"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface RoomMember {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
}

interface ChatPageProps {
  roomName?: string;
  roomCode?: string;
  messages?: ChatMessage[];
  members?: RoomMember[];
  currentUserId?: string;
  onSendMessage?: (content: string) => void;
  onLeaveRoom?: () => void;
  isSending?: boolean;
}

const DUMMY_MESSAGES: ChatMessage[] = [
  { id: "1", senderId: "2", senderName: "Rin Inoue", content: "Hey, just pushed the new branch", timestamp: "9:01 AM", isOwn: false },
  { id: "2", senderId: "1", senderName: "You", content: "Nice, I'll take a look now", timestamp: "9:02 AM", isOwn: true },
  { id: "3", senderId: "3", senderName: "Marc Dubois", content: "Should we hop on a call later?", timestamp: "9:04 AM", isOwn: false },
  { id: "4", senderId: "1", senderName: "You", content: "Works for me, say 3pm?", timestamp: "9:05 AM", isOwn: true },
  { id: "5", senderId: "2", senderName: "Rin Inoue", content: "3pm works 👍", timestamp: "9:06 AM", isOwn: false },
];

const DUMMY_MEMBERS: RoomMember[] = [
  { id: "1", name: "Ada Lovelace", isOnline: true },
  { id: "2", name: "Rin Inoue", isOnline: true },
  { id: "3", name: "Marc Dubois", isOnline: false },
  { id: "4", name: "Priya Nair", isOnline: false },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ChatPage({
  roomName = "design-team",
  roomCode = "ABC-1234",
  messages = DUMMY_MESSAGES,
  members = DUMMY_MEMBERS,
  onSendMessage = () => {},
  onLeaveRoom = () => {},
  isSending = false,
}: ChatPageProps) {
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const onlineCount = members.filter((m) => m.isOnline).length;

  return (
    <div
      className="h-screen bg-[#0c0c0c] text-white flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors rounded-md hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="w-px h-4 bg-white/[0.07]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">{roomName}</span>
              {roomCode && (
                <span className="text-[10px] font-mono text-white/20 bg-white/[0.05] border border-white/[0.07] rounded px-1.5 py-0.5">
                  {roomCode}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/25 mt-0.5">{onlineCount} online</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMembers((v) => !v)}
          className={`h-7 px-3 text-xs gap-1.5 transition-colors ${
            showMembers ? "text-white/60 bg-white/5" : "text-white/25 hover:text-white/50 hover:bg-white/5"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          {members.length}
        </Button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-4 py-5">
            <div className="space-y-5 max-w-2xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-sm text-white/20">No messages yet</p>
                  <p className="text-xs text-white/12 mt-1">Be the first to say something</p>
                </div>
              ) : (
                messages.map((msg) =>
                  msg.isOwn ? (
                    <div key={msg.id} className="flex justify-end group">
                      <div className="max-w-[65%]">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.timestamp}
                          </span>
                        </div>
                        <div className="bg-white/[0.09] border border-white/[0.07] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white/85">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex items-end gap-2.5 group">
                      <Avatar className="h-6 w-6 flex-shrink-0 border border-white/[0.08]">
                        <AvatarImage src={msg.senderAvatarUrl} alt={msg.senderName} />
                        <AvatarFallback className="bg-white/[0.06] text-white/40 text-[9px]">
                          {getInitials(msg.senderName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[65%]">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs text-white/40">{msg.senderName}</span>
                          <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.timestamp}
                          </span>
                        </div>
                        <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm text-white/75">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-white/[0.06] px-4 py-3 flex-shrink-0">
            <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${roomName}...`}
                disabled={isSending}
                className="flex-1 bg-white/[0.04] border-white/[0.07] text-white placeholder:text-white/20 focus-visible:ring-white/15 focus-visible:border-white/20 h-10 text-sm rounded-xl"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isSending}
                className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-white/90 text-black flex-shrink-0 disabled:opacity-20"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </Button>
            </form>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <aside className="w-52 border-l border-white/[0.06] flex-shrink-0 hidden md:flex flex-col">
            <div className="px-4 py-3 border-b border-white/[0.05]">
              <p className="text-[10px] text-white/25 uppercase tracking-widest">Members</p>
            </div>
            <ScrollArea className="flex-1 px-3 py-3">
              {members.filter((m) => m.isOnline).length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest px-1 mb-1.5">
                    Online
                  </p>
                  {members.filter((m) => m.isOnline).map((member) => (
                    <div key={member.id} className="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-6 w-6 border border-white/[0.07]">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback className="bg-white/[0.06] text-white/40 text-[9px]">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-white/60 border border-[#0c0c0c]" />
                      </div>
                      <span className="text-xs text-white/55 truncate">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {members.filter((m) => !m.isOnline).length > 0 && (
                <div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest px-1 mb-1.5">
                    Offline
                  </p>
                  {members.filter((m) => !m.isOnline).map((member) => (
                    <div key={member.id} className="flex items-center gap-2 px-1 py-1.5 rounded-md opacity-40">
                      <Avatar className="h-6 w-6 border border-white/[0.07] flex-shrink-0">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback className="bg-white/[0.04] text-white/30 text-[9px]">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white/40 truncate">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>
        )}
      </div>
    </div>
  );
}