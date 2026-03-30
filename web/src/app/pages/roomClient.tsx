"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage, { ChatMessage, RoomMember } from "@/components/ui/chat";
import axios from "axios";

// Matches exactly what the server broadcasts for a chat event
interface WsChatEvent {
  type: "chat";
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  roomID: string;
  timestamp: string;
}

interface WsMemberEvent {
  type: "member_joined" | "member_left";
  memberId: string;
  memberName: string;
}

type WsEvent = WsChatEvent | WsMemberEvent;

interface RoomClientProps {
  roomID: string;
}

const MAX_RECONNECTS = 5;

export default function RoomClient({ roomID }: RoomClientProps) {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [roomName, setRoomName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [wsReady, setWsReady] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  // Refs stay fresh inside WS callbacks — no stale closure bugs
  const currentUserIdRef = useRef("");
  const currentUserNameRef = useRef("");

  // Reassigned every render so onmessage always calls the latest version
  const handleWsEventRef = useRef<(data: WsEvent) => void>(() => {});

  // ── HTTP: fetch room ───────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/auth"); return; }

    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/rooms/join/${roomID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userId: string = res.data.currentUserId ?? "";
        const userName: string = res.data.currentUserName ?? "";

        setCurrentUserId(userId);
        currentUserIdRef.current = userId;
        currentUserNameRef.current = userName;

        const adapted: ChatMessage[] = (res.data.messages ?? []).map(
          (m: {
            id: string | number;
            userId: string;          // server stores as userId not senderId
            user?: { username?: string };
            message: string;         // server field is message not content
            createdAt?: string;
            timestamp?: string;
          }) => ({
            id: String(m.id),
            senderId: String(m.userId),
            senderName: m.user?.username ?? "Unknown",
            content: m.message,
            timestamp: formatTime(m.createdAt ?? m.timestamp ?? ""),
            isOwn: String(m.userId) === userId,
          })
        );

        setMessages(adapted);
        setMembers(res.data.members ?? []);
        setRoomName(res.data.slug ?? roomID);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) { router.replace("/auth"); return; }
          setError(err.response?.data?.message ?? "Failed to load room.");
        } else {
          setError("Unexpected error. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomID, router]);

  // ── Always-fresh WS event handler ─────────────────────────────────────────
  handleWsEventRef.current = (data: WsEvent) => {
    if (data.type === "chat") {
      // Skip own messages — already appended optimistically on send
      if (data.senderId === currentUserIdRef.current) return;

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          senderId: data.senderId,
          senderName: data.senderName,
          content: data.message,
          timestamp: formatTime(data.timestamp),
          isOwn: false,
        },
      ]);
    }

    if (data.type === "member_joined") {
      setMembers((prev) => {
        if (prev.some((m) => m.id === data.memberId)) return prev;
        return [...prev, { id: data.memberId, name: data.memberName, isOnline: true }];
      });
    }

    if (data.type === "member_left") {
      setMembers((prev) =>
        prev.map((m) => (m.id === data.memberId ? { ...m, isOnline: false } : m))
      );
    }
  };

  // ── WebSocket connect + reconnect ─────────────────────────────────────────
  useEffect(() => {
    if (loading || error) return;

    const token = localStorage.getItem("token");

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", roomID }));
        setWsReady(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WsEvent = JSON.parse(event.data as string);
          handleWsEventRef.current(data);
        } catch {
          console.warn("Unrecognised WS payload:", event.data);
        }
      };

      ws.onerror = () => { console.error("WebSocket error"); };

      ws.onclose = (event: CloseEvent) => {
        setWsReady(false);
        wsRef.current = null;
        if (event.code === 1000) return;

        if (reconnectAttempts.current < MAX_RECONNECTS) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
          reconnectAttempts.current += 1;
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
          reconnectTimer.current = setTimeout(connect, delay);
        } else {
          setError("Lost connection. Please refresh.");
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close(1000, "unmount");
    };
  }, [loading, error, roomID]);

  // ── Send message ──────────────────────────────────────────────────────────
  function onSendMessage(content: string) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Not connected. Please wait or refresh.");
      return;
    }

    // Append own message immediately — don't wait for server echo
    const optimisticMsg: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      senderId: currentUserIdRef.current,
      senderName: currentUserNameRef.current,
      content,
      timestamp: formatTime(new Date().toISOString()),
      isOwn: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    setIsSending(true);
    try {
      ws.send(JSON.stringify({ type: "chat", roomID, message: content }));
    } catch {
      // Roll back on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setError("Failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  // ── Leave room ────────────────────────────────────────────────────────────
  function onLeaveRoom() {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "leave", roomID }));
      wsRef.current.close(1000, "left room");
    }
    router.push("/dashboard");
  }

  function formatTime(raw: string): string {
    if (!raw) return "";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen bg-[#0e0e0d] flex items-center justify-center">
        <p className="text-sm text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading room…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0e0e0d] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-white/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-white/25 hover:text-white/60 transition-colors underline underline-offset-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {!wsReady && (
        <div
          className="fixed top-0 left-0 right-0 z-50 text-center py-1.5 text-xs"
          style={{
            background: "rgba(14,14,13,0.97)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(226,224,219,0.35)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Reconnecting…
        </div>
      )}
      <ChatPage
        roomCode={roomID}
        roomName={roomName}
        messages={messages}
        members={members}
        currentUserId={currentUserId}
        onSendMessage={onSendMessage}
        onLeaveRoom={onLeaveRoom}
        isSending={isSending}
      />
    </div>
  );
}