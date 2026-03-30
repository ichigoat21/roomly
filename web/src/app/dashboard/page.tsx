"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DashboardPage, { Room, User } from "./dashboard";
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
  }, []); // only run once on mount — params won't change after that

  async function fetchUserProfile(token: string) {
    try {
      const response = await axios.get("http://localhost:3000/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        name: response.data.username,
        email: response.data.user.email,
      });

      // Normalize rooms so null fields don't blow up the UI
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
      console.log(roomId)
      console.log(response.data)

      // Optimistically add room to list
      setRooms((prev) => [
        {
          id: roomId,
          name: slug.trim(),
          memberCount: 1,
          lastMessage: undefined,
          lastMessageAt: undefined,
        },
        ...prev,
      ]);

      // Navigate with Next router — no full page reload
      router.push(`/room/${roomId}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/auth");
        return;
      }
      console.error("Failed to create room:", err);
    }
  }

  async function joinRoom(roomID: string) {
    if (!roomID.trim()) return;
    const token = localStorage.getItem("token");
    const url = `http://localhost:3000/rooms/join/${roomID.trim()}`

    try {
      await axios.get(`http://localhost:3000/rooms/join/${roomID.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(url)

      router.push(`/room/${roomID.trim()}`);
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

  // ── States ────────────────────────────────────────────────────────────────
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
      currentUser={user}
      rooms={rooms}
      onCreateRoom={createRoom}
      onJoinRoom={joinRoom}
      onEnterRoom={onEnterRoom}
      onSignOut={onSignOut}
    />
  );
}