"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthPageProps {
  onGoogleSignIn?: () => void;
  onLogin?: (email: string, password: string) => void;
  onSignup?: (name: string, email: string, password: string) => void;
  isSignedUp? : boolean;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function AuthComponent({
  onGoogleSignIn = () => {},
  onLogin = () => {},
  onSignup = () => {},
  isLoading = false,
  errorMessage,
}: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") onLogin(email, password);
    else onSignup(name, email, password);
  };



  return (
    <div
      className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold tracking-tight text-white">roomly..</span>
          <p className="mt-4 text-2xl font-semibold tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </p>
          <p className="mt-1.5 text-sm text-white/35">
            {mode === "login" ? "Sign in to continue" : "Join and start collaborating"}
          </p>
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors gap-3 h-10 text-sm"
          onClick={onGoogleSignIn}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-white/20">or</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Toggle */}
        <div className="flex rounded-lg bg-white/[0.04] p-0.5 border border-white/[0.07] mb-6">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-md py-1.5 text-sm transition-all ${
                mode === m ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-white/40">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 focus-visible:border-white/20 h-10 text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-white/40">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 focus-visible:border-white/20 h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-white/40">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 focus-visible:border-white/20 h-10 text-sm"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/15 rounded-md px-3 py-2">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-white text-black hover:bg-white/90 text-sm font-medium mt-1"
          >
            {isLoading
              ? mode === "login" ? "Signing in..." : "Creating account..."
              : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-white/20">
          By continuing you agree to our{" "}
          <span className="text-white/40 cursor-pointer hover:text-white/60 transition-colors">Terms</span>
          {" & "}
          <span className="text-white/40 cursor-pointer hover:text-white/60 transition-colors">Privacy</span>
        </p>
      </div>
    </div>
  );
}