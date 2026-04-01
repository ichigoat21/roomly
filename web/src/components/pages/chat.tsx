"use client";

import { useState, useRef, useEffect } from "react";
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
  roomName: string;
  roomCode: string;
  messages: ChatMessage[];
  members: RoomMember[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onLeaveRoom: () => void;
  isSending?: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface MessageGroup {
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  isOwn: boolean;
  messages: ChatMessage[];
}

function groupMessages(messages: ChatMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const msg of messages) {
    const last = groups[groups.length - 1];
    if (last && last.senderId === msg.senderId) {
      last.messages.push(msg);
    } else {
      groups.push({
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatarUrl: msg.senderAvatarUrl,
        isOwn: msg.isOwn,
        messages: [msg],
      });
    }
  }
  return groups;
}

export default function ChatPage({
  roomName,
  roomCode,
  messages,
  members,
  onSendMessage,
  onLeaveRoom,
  isSending = false,
}: ChatPageProps) {
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false); // default closed on mobile
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isSending) return;
      onSendMessage(trimmed);
      setInput("");
    }
  };

  const onlineMembers = members.filter((m) => m.isOnline);
  const offlineMembers = members.filter((m) => !m.isOnline);
  const groups = groupMessages(messages);
  const canSend = input.trim().length > 0 && !isSending;

  return (
    <div
      style={{
        height: "100dvh",          // dvh handles mobile browser chrome properly
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#0e0e0d",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e0db",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "#0e0e0d",
        padding: "0 12px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
      }}>
        {/* Left: back + room info */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <button
            onClick={onLeaveRoom}
            style={{
              flexShrink: 0,
              width: "32px", height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(226,224,219,0.35)",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(226,224,219,0.75)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(226,224,219,0.35)"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: "16px", height: "16px" }} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>

          <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{
                fontSize: "14px", fontWeight: 500,
                color: "rgba(226,224,219,0.88)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                maxWidth: "140px",
              }}>
                {roomName}
              </span>
              {/* Room code — hidden on very small screens */}
              {roomCode && (
                <span style={{
                  fontSize: "10px", fontFamily: "monospace",
                  color: "rgba(226,224,219,0.2)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px", padding: "1px 6px",
                  letterSpacing: "0.05em", flexShrink: 0,
                }}
                className="hidden sm:inline"
                >
                  {roomCode}
                </span>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "rgba(226,224,219,0.25)", marginTop: "1px" }}>
              {onlineMembers.length} online
            </p>
          </div>
        </div>

        {/* Right: members toggle */}
        <button
          onClick={() => setShowMembers(v => !v)}
          style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: "5px",
            height: "30px", padding: "0 10px",
            borderRadius: "8px",
            border: `1px solid ${showMembers ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.07)"}`,
            background: showMembers ? "rgba(255,255,255,0.07)" : "transparent",
            color: showMembers ? "rgba(226,224,219,0.65)" : "rgba(226,224,219,0.28)",
            fontSize: "12px", cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: "13px", height: "13px" }} stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span>{members.length}</span>
        </button>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Messages area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <ScrollArea style={{ flex: 1 }}>
            <div style={{ padding: "16px 14px 8px", maxWidth: "680px", margin: "0 auto" }}>
              {groups.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: "17px", height: "17px", color: "rgba(226,224,219,0.15)" }} stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(226,224,219,0.2)" }}>No messages yet</p>
                  <p style={{ fontSize: "11px", color: "rgba(226,224,219,0.1)", marginTop: "3px" }}>
                    Be the first to say something
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {groups.map((group, gi) =>
                    group.isOwn ? (
                      /* Own messages — right */
                      <div key={gi} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <span style={{ fontSize: "11px", color: "rgba(226,224,219,0.28)", marginBottom: "5px", fontWeight: 500 }}>
                          You
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", maxWidth: "min(72%, 420px)" }}>
                          {group.messages.map((msg, mi) => {
                            const isFirst = mi === 0;
                            const isLast = mi === group.messages.length - 1;
                            const isOnly = group.messages.length === 1;
                            const br = isOnly
                              ? "14px 14px 4px 14px"
                              : isFirst ? "14px 14px 4px 14px"
                              : isLast  ? "4px 14px 14px 14px"
                              :           "4px 14px 4px 14px";
                            return (
                              <div key={msg.id} title={msg.timestamp} style={{
                                background: "rgba(226,224,219,0.1)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: br,
                                padding: "7px 12px",
                                fontSize: "13.5px",
                                color: "rgba(226,224,219,0.88)",
                                lineHeight: 1.55,
                                wordBreak: "break-word",
                              }}>
                                {msg.content}
                              </div>
                            );
                          })}
                        </div>
                        <span style={{ fontSize: "10px", color: "rgba(226,224,219,0.18)", marginTop: "4px" }}>
                          {group.messages[group.messages.length - 1].timestamp}
                        </span>
                      </div>
                    ) : (
                      /* Others' messages — left */
                      <div key={gi} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                        <div style={{ flexShrink: 0, paddingTop: "2px" }}>
                          <Avatar style={{ width: "26px", height: "26px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <AvatarImage src={group.senderAvatarUrl} alt={group.senderName} />
                            <AvatarFallback style={{
                              background: "rgba(255,255,255,0.07)",
                              color: "rgba(226,224,219,0.45)",
                              fontSize: "9px", fontWeight: 500,
                            }}>
                              {getInitials(group.senderName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "5px" }}>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(226,224,219,0.5)" }}>
                              {group.senderName}
                            </span>
                            <span style={{ fontSize: "10px", color: "rgba(226,224,219,0.18)" }}>
                              {group.messages[0].timestamp}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", maxWidth: "min(72%, 420px)" }}>
                            {group.messages.map((msg, mi) => {
                              const isFirst = mi === 0;
                              const isLast = mi === group.messages.length - 1;
                              const isOnly = group.messages.length === 1;
                              const br = isOnly
                                ? "4px 14px 14px 14px"
                                : isFirst ? "4px 14px 14px 14px"
                                : isLast  ? "4px 14px 14px 14px"
                                :           "4px 14px 14px 4px";
                              return (
                                <div key={msg.id} title={msg.timestamp} style={{
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  borderRadius: br,
                                  padding: "7px 12px",
                                  fontSize: "13.5px",
                                  color: "rgba(226,224,219,0.75)",
                                  lineHeight: 1.55,
                                  wordBreak: "break-word",
                                }}>
                                  {msg.content}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
              <div ref={bottomRef} style={{ height: "1px" }} />
            </div>
          </ScrollArea>

          {/* ── Input bar ─────────────────────────────────────────────────── */}
          <div style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 12px",
            backgroundColor: "#0e0e0d",
            // Safe area for iOS notch
            paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
          }}>
            <form
              onSubmit={handleSend}
              style={{
                maxWidth: "680px", margin: "0 auto",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${roomName}…`}
                disabled={isSending}
                autoComplete="off"
                style={{
                  flex: 1,
                  height: "40px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "11px",
                  padding: "0 14px",
                  fontSize: "14px",
                  color: "#e2e0db",
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.15s",
                  // Prevent iOS zoom on focus (font-size must be ≥16px to avoid it,
                  // but we handle it via the meta viewport tag)
                  WebkitAppearance: "none",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
              <button
                type="submit"
                disabled={!canSend}
                style={{
                  flexShrink: 0,
                  width: "40px", height: "40px",
                  borderRadius: "11px",
                  border: "none",
                  background: canSend ? "rgba(226,224,219,0.92)" : "rgba(255,255,255,0.06)",
                  cursor: canSend ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: canSend ? "#0e0e0d" : "rgba(226,224,219,0.2)",
                  transition: "background 0.15s, transform 0.1s",
                }}
                onMouseEnter={e => { if (canSend) e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: "15px", height: "15px" }} stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* ── Members sidebar (desktop) / slide-over (mobile) ─────────────── */}
        {showMembers && (
          <>
            {/* Mobile backdrop */}
            <div
              onClick={() => setShowMembers(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 20,
                background: "rgba(0,0,0,0.45)",
              }}
              className="md:hidden"
            />

            <aside style={{
              position: "fixed" as const,
              top: "52px", right: 0, bottom: 0,
              width: "220px",
              zIndex: 30,
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              backgroundColor: "#0e0e0d",
              display: "flex", flexDirection: "column",
            }}
            // On md+ override to static so it sits in the flex row
            className="md:static md:z-auto"
            >
              <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "10px", color: "rgba(226,224,219,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Members
                  </p>
                  {/* Close button — mobile only */}
                  <button
                    onClick={() => setShowMembers(false)}
                    className="md:hidden"
                    style={{
                      width: "22px", height: "22px", borderRadius: "6px",
                      border: "none", background: "transparent", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(226,224,219,0.3)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: "13px", height: "13px" }} stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <ScrollArea style={{ flex: 1, padding: "10px 10px" }}>
                {onlineMembers.length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <p style={{ fontSize: "10px", color: "rgba(226,224,219,0.2)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 4px", marginBottom: "4px" }}>
                      Online · {onlineMembers.length}
                    </p>
                    {onlineMembers.map(m => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "5px 4px", borderRadius: "7px",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <Avatar style={{ width: "24px", height: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <AvatarImage src={m.avatarUrl} alt={m.name} />
                            <AvatarFallback style={{ background: "rgba(255,255,255,0.07)", color: "rgba(226,224,219,0.45)", fontSize: "9px" }}>
                              {getInitials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span style={{
                            position: "absolute", bottom: "-1px", right: "-1px",
                            width: "7px", height: "7px", borderRadius: "50%",
                            background: "rgba(226,224,219,0.5)",
                            border: "1.5px solid #0e0e0d",
                          }} />
                        </div>
                        <span style={{ fontSize: "12px", color: "rgba(226,224,219,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {offlineMembers.length > 0 && (
                  <div>
                    <p style={{ fontSize: "10px", color: "rgba(226,224,219,0.15)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 4px", marginBottom: "4px" }}>
                      Offline · {offlineMembers.length}
                    </p>
                    {offlineMembers.map(m => (
                      <div key={m.id} style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "5px 4px", opacity: 0.35,
                      }}>
                        <Avatar style={{ width: "24px", height: "24px", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                          <AvatarImage src={m.avatarUrl} alt={m.name} />
                          <AvatarFallback style={{ background: "rgba(255,255,255,0.05)", color: "rgba(226,224,219,0.35)", fontSize: "9px" }}>
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span style={{ fontSize: "12px", color: "rgba(226,224,219,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {members.length === 0 && (
                  <p style={{ fontSize: "11px", color: "rgba(226,224,219,0.15)", padding: "4px" }}>No members yet</p>
                )}
              </ScrollArea>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}