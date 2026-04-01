"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DashboardPage, { Room, User } from "@/components/pages/dashboard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const params = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = params.get("token");
    if (urlToken) localStorage.setItem("token", urlToken);

    const token = urlToken || localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }

    fetchUserProfile(token);
  }, []);

  async function fetchUserProfile(token: string) {
    try {
      const response = await axios.get("http://localhost:3000/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      

      setUser({
        name: response.data.username,
        email: response.data.user.email,
        avatarUrl: response.data.image
      });
      console.log(user?.name)
      console.log(user?.avatarUrl)

      const raw = response.data.rooms ?? [];
      setRooms(
        raw.map((r: {
          id: string;
          slug?: string;
          name?: string;
          memberCount?: number;
          lastMessage?: string | null;
          lastMessageAt?: string | null;
        }) => ({
          id: r.id,
          name: r.slug ?? r.name ?? "Untitled",
          memberCount: r.memberCount ?? 1,
          lastMessage: r.lastMessage ?? undefined,
          lastMessageAt: r.lastMessageAt ?? undefined,
        }))
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/auth");
        return;
      }
      setLoadingError("Failed to load profile. Please refresh.");
    }
  }

  async function onUpdateUsername(username: string) {
    await axios.patch(
      "http://localhost:3000/profile/change",
      { username },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setUser((prev) => prev ? { ...prev, name: username } : prev);
  }

  async function onUpdateAvatar(file: File) {
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await axios.post(
      "http://localhost:3000/profile/avatar",
      fd,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const avatarUrl: string = res.data.image;
    console.log(avatarUrl)
    // Bust browser cache so <img> actually fetches the new avatar
    setUser((prev) =>
      prev ? { ...prev, avatarUrl: `${avatarUrl}?t=${Date.now()}` } : prev
    );
  }

  async function createRoom(slug: string) {
    if (!slug.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:3000/rooms/create",
        { slug: slug.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const roomId = response.data.room;
      setRooms((prev) => [
        { id: roomId, name: slug.trim(), memberCount: 1 },
        ...prev,
      ]);
      router.push(`/room/${roomId}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/auth");
        return;
      }
      console.error("Failed to create room:", err);
    }
  }

  async function joinRoom(roomId: string) {
    if (!roomId.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await axios.get(`http://localhost:3000/rooms/join/${roomId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push(`/room/${roomId.trim()}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/auth");
        return;
      }
      console.error("Failed to join room:", err);
    }
  }

  function onEnterRoom(roomId: string) {
    router.push(`/room/${roomId}`);
  }

  function onSignOut() {
    localStorage.removeItem("token");
    router.replace("/auth");
  }

  if (loadingError) {
    return (
      <div className="h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/40">{loadingError}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-white/25 hover:text-white/60 transition-colors underline underline-offset-4"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#0c0c0c] flex items-center justify-center">
        <p className="text-sm text-white/30">Loading…</p>
      </div>
    );
  }

  return (
    <DashboardPage
      key={`${user.name}-${user.avatarUrl}`}
      currentUser={user}
      rooms={rooms}
      onCreateRoom={createRoom}
      onJoinRoom={joinRoom}
      onEnterRoom={onEnterRoom}
      onSignOut={onSignOut}
      onUpdateUsername={onUpdateUsername}
      onUpdateAvatar={onUpdateAvatar}
    />
  );
}