"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage, { ChatMessage, RoomMember } from "@/components/ui/chat";
import axios from "axios";

// ── Shape of every WS message from the server ─────────────────────────────
interface WsMessageEvent {
  type: "message";
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface WsMemberEvent {
  type: "member_joined" | "member_left";
  memberId: string;
  memberName: string;
}

type WsEvent = WsMessageEvent | WsMemberEvent;
// ─────────────────────────────────────────────────────────────────────────────

export default function Page({ params }: { params: { roomID: string } }) {
  const { roomID } = params;
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [roomName, setRoomName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [wsReady, setWsReady] = useState(false);

  // Keep ws in a ref so callbacks always see the latest instance
  // without triggering re-renders
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECTS = 5;

  // ── HTTP: fetch room data ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/rooms/join/${roomID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Adapt server response → ChatMessage shape.
        // Adjust field names here if your backend differs.
        const userId: string = res.data.currentUserId ?? "";
        setCurrentUserId(userId);

        const adapted: ChatMessage[] = (res.data.messages ?? []).map(
          (m: {
            id: string;
            senderId: string;
            senderName: string;
            content: string;
            timestamp: string;
          }) => ({
            id: m.id,
            senderId: m.senderId,
            senderName: m.senderName,
            content: m.content,
            timestamp: formatTime(m.timestamp),
            isOwn: m.senderId === userId,
          })
        );

        setMessages(adapted);
        setMembers(res.data.members ?? []);
        setRoomName(res.data.slug ?? roomID);
        setLoading(false);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            router.replace("/auth");
            return;
          }
          setError(err.response?.data?.message ?? "Failed to load room.");
        } else {
          setError("Unexpected error. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomID, router]);

  // ── WebSocket: connect + reconnect ───────────────────────────────────────
  useEffect(() => {
    if (loading || error) return; // don't connect until room data is ready

    const token = localStorage.getItem("token");

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", roomID }));
        setWsReady(true);
        reconnectAttempts.current = 0; // reset on successful connect
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WsEvent = JSON.parse(event.data as string);
          handleWsEvent(data);
        } catch {
          console.warn("Unrecognised WS payload", event.data);
        }
      };

      ws.onerror = () => {
        // onerror is always followed by onclose — handle there
        console.error("WebSocket error");
      };

      ws.onclose = (event: CloseEvent) => {
        setWsReady(false);
        wsRef.current = null;

        // 1000 = normal closure (user left intentionally), don't reconnect
        if (event.code === 1000) return;

        if (reconnectAttempts.current < MAX_RECONNECTS) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
          reconnectAttempts.current += 1;
          console.log(`WS closed. Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
          reconnectTimer.current = setTimeout(connect, delay);
        } else {
          setError("Lost connection to the server. Please refresh.");
        }
      };
    };

    connect();

    return () => {
      // Clean up on unmount: close normally so onclose won't reconnect
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close(1000, "unmount");
      }
    };
  }, [loading, error, roomID]);

  // ── Handle incoming WS events ────────────────────────────────────────────
  function handleWsEvent(data: WsEvent) {
    if (data.type === "message") {
      const userId = currentUserId;
      const newMsg: ChatMessage = {
        id: data.id,
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        timestamp: formatTime(data.timestamp),
        isOwn: data.senderId === userId,
      };
      setMessages((prev) => [...prev, newMsg]);
    }

    if (data.type === "member_joined") {
      setMembers((prev) => {
        if (prev.some((m) => m.id === data.memberId)) return prev;
        return [
          ...prev,
          { id: data.memberId, name: data.memberName, isOnline: true },
        ];
      });
    }

    if (data.type === "member_left") {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === data.memberId ? { ...m, isOnline: false } : m
        )
      );
    }
  }

  // ── Send message ─────────────────────────────────────────────────────────
  async function onSendMessage(content: string) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Not connected. Please wait or refresh.");
      return;
    }

    setIsSending(true);
    try {
      ws.send(
        JSON.stringify({
          type: "message",
          roomID,
          content,
        })
      );
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  // ── Leave room ───────────────────────────────────────────────────────────
  function onLeaveRoom() {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "leave", roomID }));
      wsRef.current.close(1000, "left room");
    }
    router.push("/dashboard");
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function formatTime(raw: string): string {
    if (!raw) return "";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw; // return as-is if not a valid date
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ── States ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen bg-[#0c0c0c] flex items-center justify-center">
        <p className="text-sm text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading room…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-4">
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
      {/* Connection status banner */}
      {!wsReady && !error && (
        <div
          className="fixed top-0 left-0 right-0 z-50 text-center py-1.5 text-xs"
          style={{
            background: "rgba(17,17,16,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(232,230,225,0.35)",
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
