"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileModal } from "@/components/pages/profile";
import type { ProfileUser } from "@/components/pages/profile";

export interface Room {
  id: string;
  name: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  isActive?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface DashboardPageProps {
  currentUser?: User;
  rooms?: Room[];
  onCreateRoom?: (roomName: string) => void;
  onJoinRoom?: (roomCode: string) => void;
  onEnterRoom?: (roomId: string) => void;
  onSignOut?: () => void;
  onUpdateUsername?: (username: string) => Promise<void>;
  onUpdateAvatar?: (file: File) => Promise<void>;
}

const DUMMY_USER: User = {
  name: "Ada Lovelace",
  email: "ada@example.com",
};

const DUMMY_ROOMS: Room[] = [
  { id: "1", name: "design-team", memberCount: 5, lastMessage: "Let's sync tomorrow", lastMessageAt: "2:30 PM", isActive: true },
  { id: "2", name: "backend-crew", memberCount: 3, lastMessage: "PR is ready for review", lastMessageAt: "11:14 AM", isActive: false },
  { id: "3", name: "general", memberCount: 12, lastMessage: "Good morning everyone!", lastMessageAt: "9:01 AM", isActive: true },
];

export default function DashboardPage({
  currentUser = DUMMY_USER,
  rooms = DUMMY_ROOMS,
  onCreateRoom = () => {},
  onJoinRoom = () => {},
  onEnterRoom = () => {},
  onSignOut = () => {},
  onUpdateUsername = async () => {},
  onUpdateAvatar = async () => {},
}: DashboardPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Map User → ProfileUser shape that ProfileModal expects
  const profileUser: ProfileUser = {
    username: currentUser.name,
    email: currentUser.email,
    avatarUrl: currentUser.avatarUrl,
  };

  return (
    <div
      className="min-h-screen bg-[#0c0c0c] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navbar */}
      <header className="border-b border-white/[0.06] px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">roomly..</span>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-white/60">{currentUser.name}</span>
              <span className="text-[11px] text-white/25">{currentUser.email}</span>
            </div>

            {/* Clickable avatar → opens profile modal */}
            <button
              onClick={() => setShowProfile(true)}
              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-opacity hover:opacity-80"
            >
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="bg-white/10 text-white/60 text-[10px]">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-white/30 hover:text-white/70 hover:bg-white/5 text-xs h-7 px-3"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Your Rooms
            </h1>
            <p className="mt-1 text-sm text-white/35">
              Jump back in or start something new.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowJoin(true)}
              variant="outline"
              size="sm"
              className="border-white/[0.08] bg-transparent text-white/50 hover:bg-white/5 hover:text-white text-xs h-8 px-3"
            >
              Join room
            </Button>
            <Button
              onClick={() => setShowCreate(true)}
              size="sm"
              className="bg-white text-black hover:bg-white/90 text-xs h-8 px-3 font-medium"
            >
              Create room
            </Button>
          </div>
        </div>

        {/* Rooms */}
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-white/[0.07] rounded-xl py-20 text-center">
            <p className="text-sm text-white/25">No rooms yet</p>
            <p className="text-xs text-white/15 mt-1">Create or join a room to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05] border border-white/[0.07] rounded-xl overflow-hidden">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onEnterRoom(room.id)}
                className="flex items-center justify-between px-5 py-4 bg-white/[0.01] hover:bg-white/[0.04] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white/50">
                      {room.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">
                      {room.name}
                    </p>
                    {room.lastMessage && (
                      <p className="text-xs text-white/25 truncate mt-0.5">{room.lastMessage}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <div className="flex items-center gap-1.5">
                    {room.isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                    <span className="text-xs text-white/20">{room.memberCount}</span>
                  </div>
                  {room.lastMessageAt && (
                    <span className="text-xs text-white/20 hidden sm:block">{room.lastMessageAt}</span>
                  )}
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white/15 group-hover:text-white/40 transition-colors" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Profile Modal ── */}
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={profileUser}
        onUpdateUsername={onUpdateUsername}
        onUpdateAvatar={onUpdateAvatar}
      />

      {/* ── Create Room Dialog ── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#111111] border-white/[0.08] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Create a room</DialogTitle>
            <DialogDescription className="text-white/35 text-xs">
              Give your room a name others will recognize.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1 space-y-4">
            <Input
              placeholder="e.g. design-team"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && roomName.trim()) {
                  onCreateRoom(roomName);
                  setRoomName("");
                  setShowCreate(false);
                }
              }}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 h-9 text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreate(false)}
                className="flex-1 text-white/40 hover:text-white hover:bg-white/5 text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={() => { onCreateRoom(roomName); setRoomName(""); setShowCreate(false); }}
                className="flex-1 bg-white text-black hover:bg-white/90 text-sm h-9 font-medium"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Join Room Dialog ── */}
      <Dialog open={showJoin} onOpenChange={setShowJoin}>
        <DialogContent className="bg-[#111111] border-white/[0.08] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Join a room</DialogTitle>
            <DialogDescription className="text-white/35 text-xs">
              Enter the code someone shared with you.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1 space-y-4">
            <Input
              placeholder="e.g. ABC-1234"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && roomCode.trim()) {
                  onJoinRoom(roomCode);
                  setRoomCode("");
                  setShowJoin(false);
                }
              }}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 h-9 text-sm font-mono tracking-widest"
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowJoin(false)}
                className="flex-1 text-white/40 hover:text-white hover:bg-white/5 text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={() => { onJoinRoom(roomCode); setRoomCode(""); setShowJoin(false); }}
                className="flex-1 bg-white text-black hover:bg-white/90 text-sm h-9 font-medium"
              >
                Join
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}