"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ProfileUser {
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface ProfileModalProps {
  open?: boolean;
  onClose?: () => void;
  user?: ProfileUser;
  onUpdateUsername?: (username: string) => Promise<void>;
  onUpdateAvatar?: (file: File) => Promise<void>;
}

interface ProfilePageProps {
  user?: ProfileUser;
  onUpdateUsername?: (username: string) => Promise<void>;
  onUpdateAvatar?: (file: File) => Promise<void>;
  onBack?: () => void;
}

const DUMMY_USER: ProfileUser = {
  username: "ada_lovelace",
  email: "ada@example.com",
};

function getInitials(name: string) {
  return name
    .replace(/_/g, " ")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ProfileForm({
  user = DUMMY_USER,
  onUpdateUsername = async () => {},
  onUpdateAvatar = async () => {},
  onDone,
}: {
  user?: ProfileUser;
  onUpdateUsername?: (u: string) => Promise<void>;
  onUpdateAvatar?: (f: File) => Promise<void>;
  onDone?: () => void;
}) {
  const [username, setUsername] = useState(user.username);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uStatus, setUStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [aStatus, setAStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uError, setUError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = username !== user.username;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(f));
    setPendingFile(f);
    setAStatus("idle");
  }

  async function saveUsername() {
    const v = username.trim();
    if (!v || v.length < 3) { setUError("At least 3 characters."); return; }
    if (!/^[a-z0-9_]+$/.test(v)) { setUError("Lowercase, numbers, underscores only."); return; }
    setUError("");
    setUStatus("saving");
    try {
      await onUpdateUsername(v);
      setUStatus("saved");

      setTimeout(() => setUStatus("idle"), 2000);
    } catch {
      setUStatus("error");
    }
  }

  async function saveAvatar() {
    if (!pendingFile) return;
    setAStatus("saving");
    try {
      await onUpdateAvatar(pendingFile);
      setAStatus("saved");
      setPendingFile(null);
      setTimeout(() => setAStatus("idle"), 2000);
    } catch {
      setAStatus("error");
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#e2e0db]">

      {/* Avatar */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Avatar</p>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative cursor-pointer flex-shrink-0 group"
          >
            <Avatar className="w-12 h-12 border border-white/10">
              <AvatarImage src={preview ?? user.avatarUrl} alt={user.username} />
              <AvatarFallback className="bg-white/[0.07] text-white/50 text-base font-medium">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white/80" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
              </svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <div>
            <p className="text-xs text-white/50 mb-0.5">
              {pendingFile ? pendingFile.name : "Click avatar to change"}
            </p>
            <p className="text-[11px] text-white/20">JPG, PNG, WebP · max 5 MB</p>
            {pendingFile && (
              <button
                onClick={saveAvatar}
                className="mt-2 h-7 px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white/70 text-[11px] transition-colors cursor-pointer border-0"
              >
                {aStatus === "saving" ? "Saving…" : aStatus === "saved" ? "✓ Saved" : aStatus === "error" ? "Failed — retry" : "Save photo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Username */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Username</p>
        <div className="flex gap-2 items-start">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/25 pointer-events-none select-none">@</span>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setUError(""); setUStatus("idle"); }}
                onKeyDown={e => { if (e.key === "Enter" && dirty) saveUsername(); }}
                placeholder="username"
                maxLength={32}
                className="w-full h-9 bg-white/[0.04] border border-white/[0.08] focus:border-white/20 rounded-lg pl-7 pr-3 text-sm text-[#e2e0db] outline-none transition-colors placeholder:text-white/20"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            {uError && <p className="text-[11px] text-red-400/70 mt-1.5">{uError}</p>}
          </div>
          <button
            onClick={saveUsername}
            disabled={!dirty || uStatus === "saving"}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className={`h-9 px-4 rounded-lg text-sm border-0 transition-colors flex-shrink-0 ${
              !dirty
                ? "bg-white/[0.03] text-white/20 cursor-default"
                : uStatus === "saved"
                ? "bg-white/[0.06] text-white/35 cursor-default"
                : "bg-white/[0.1] hover:bg-white/[0.15] text-white/75 cursor-pointer"
            }`}
          >
            {uStatus === "saving" ? "Saving…" : uStatus === "saved" ? "✓ Saved" : uStatus === "error" ? "Failed" : "Save"}
          </button>
        </div>
        <p className="text-[11px] text-white/20 mt-2">Lowercase letters, numbers, underscores only.</p>
      </div>

      {/* Email */}
      <div className="px-6 py-5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Email</p>
        <div className="h-9 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 flex items-center">
          <span className="text-sm text-white/30">{user.email}</span>
        </div>
        <p className="text-[11px] text-white/20 mt-2">Email cannot be changed here.</p>
      </div>

      {onDone && (
        <div className="px-6 pb-5">
          <button
            onClick={onDone}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="w-full h-9 rounded-lg bg-[#e2e0db]/90 hover:bg-[#e2e0db] text-[#0e0e0d] text-sm font-medium transition-colors cursor-pointer border-0"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function ProfileModal({
  open = false,
  onClose = () => {},
  user,
  onUpdateUsername,
  onUpdateAvatar,
}: ProfileModalProps) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,calc(100vw-32px))] max-h-[calc(100dvh-48px)] overflow-y-auto bg-[#111110] border border-white/[0.09] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <span className="text-sm font-medium text-white/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>Edit profile</span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors border-0 bg-transparent cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ProfileForm user={user} onUpdateUsername={onUpdateUsername} onUpdateAvatar={onUpdateAvatar} onDone={onClose} />
      </div>
    </>
  );
}

// ── Standalone Page ────────────────────────────────────────────────────────────
export default function ProfilePage({
  user,
  onUpdateUsername,
  onUpdateAvatar,
  onBack,
}: ProfilePageProps) {
  return (
    <div className="min-h-dvh bg-[#0e0e0d] text-[#e2e0db]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="h-13 border-b border-white/[0.06] px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-colors bg-transparent border-0 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <span className="text-sm font-medium text-white/60">Profile</span>
        </div>
        <span className="text-sm font-medium text-white/25 tracking-tight">Halo</span>
      </header>
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-[#111110] border border-white/[0.08] rounded-2xl overflow-hidden">
          <ProfileForm user={user} onUpdateUsername={onUpdateUsername} onUpdateAvatar={onUpdateAvatar} />
        </div>
        <p className="text-center text-[11px] text-white/15 mt-4">Changes are saved immediately.</p>
      </div>
    </div>
  );
}

// ── Profile Route Page (app/profile/page.tsx) ─────────────────────────────────
// This is the actual Next.js page component that handles token, fetches user,
// and wires everything together. Copy this into app/profile/page.tsx
export function ProfileRoutePage() {
  const params = useSearchParams();
  const router = useRouter();

  // ALL hooks must be at the top — never inside conditions
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {


    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }

    // Fetch current user profile
    axios
      .get(`${process.env.NEXT_API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          username: res.data.username,
          email: res.data.user?.email ?? res.data.email ?? "",
          avatarUrl: res.data.avatarUrl,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/auth");
          return;
        }
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update username
  async function handleUpdateUsername(username: string) {
    await axios.patch(
      `${process.env.NEXT_API_URL}/profile/change`,
      { username },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    // Update local state so UI reflects the change immediately
    setUser((prev) => prev ? { ...prev, username } : prev);
    router.push("/dashboard")
  }

  // Update avatar
  async function handleUpdateAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await axios.post(
      `${process.env.NEXT_API_URL}/avatar`,
      formData,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    // Assume server returns { avatarUrl: "..." }
    const avatarUrl: string = res.data.avatarUrl;
    setUser((prev) => prev ? { ...prev, avatarUrl } : prev);
  }

  // Loading / error states — AFTER all hooks
  if (loading) {
    return (
      <div className="h-dvh bg-[#0e0e0d] flex items-center justify-center">
        <p className="text-sm text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh bg-[#0e0e0d] flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-white/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-white/25 hover:text-white/60 transition-colors underline underline-offset-4"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <ProfilePage
      user={user ?? undefined}
      onUpdateUsername={handleUpdateUsername}
      onUpdateAvatar={handleUpdateAvatar}
      onBack={() => router.push("/dashboard")}
    />
  );
}