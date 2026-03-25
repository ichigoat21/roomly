"use client";

import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const features = [
  {
    title: "Instant Rooms",
    description: "Create a room in one click. Share a code and your team is in.",
  },
  {
    title: "Real-time Chat",
    description: "Messages appear instantly. No refresh, no delay.",
  },
  {
    title: "Always Simple",
    description: "No cluttered dashboards. Just rooms, people, and messages.",
  },
];

export default function LandingPage({
  onGetStarted = () => {},
  onSignIn = () => {},
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-white">Halo</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignIn}
              className="text-white/50 hover:text-white hover:bg-white/5 text-sm h-8 px-4"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              onClick={onGetStarted}
              className="bg-white text-black hover:bg-white/90 text-sm h-8 px-4 font-medium"
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-6">
            Collaborative chat
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.08] mb-6 max-w-2xl"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            A room for every conversation
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-md leading-relaxed mb-10">
            Create rooms, invite people, and talk. No accounts required to join. No noise, no distractions.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={onGetStarted}
              className="bg-white text-black hover:bg-white/90 h-11 px-7 text-sm font-medium w-full sm:w-auto"
            >
              Create a room
            </Button>
            <Button
              variant="ghost"
              onClick={onSignIn}
              className="text-white/50 hover:text-white hover:bg-white/5 h-11 px-7 text-sm w-full sm:w-auto"
            >
              Sign in
            </Button>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Features */}
        <section className="px-6 py-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]">
            {features.map((f) => (
              <div key={f.title} className="bg-[#0c0c0c] p-8">
                <p className="text-sm font-medium text-white mb-2">{f.title}</p>
                <p className="text-sm text-white/35 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* CTA */}
        <section className="px-6 py-24 text-center">
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Ready to start?
          </h2>
          <p className="text-white/35 text-sm mb-8">Takes about ten seconds.</p>
          <Button
            onClick={onGetStarted}
            className="bg-white text-black hover:bg-white/90 h-11 px-8 text-sm font-medium"
          >
            Get started free
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-white/20">© 2025 Halo</span>
          <span className="text-xs text-white/20">Simple. Fast. Yours.</span>
        </div>
      </footer>
    </div>
  );
}