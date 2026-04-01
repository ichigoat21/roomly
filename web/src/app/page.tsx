"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const go = () => router.push("/auth");

  return (
    <div className="min-h-screen flex flex-col bg-[#111110] text-[#e8e6e1] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');
        .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-1 { animation-delay: 0ms; }
        .fade-up-2 { animation-delay: 80ms; }
        .fade-up-3 { animation-delay: 160ms; }
        .fade-up-4 { animation-delay: 240ms; }
        .fade-up-5 { animation-delay: 320ms; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,185,160,0.06) 0%, transparent 70%)" }}
      />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 h-14 border-b border-white/[0.06]">
        <span className="text-[15px] font-medium tracking-tight">roomly..</span>
        <div className="flex items-center gap-2">
          <button
            onClick={go}
            className="h-[34px] px-4 text-[13px] font-normal rounded-[10px] border border-white/[0.08] bg-transparent text-[#e8e6e1]/45 hover:text-[#e8e6e1]/80 hover:border-white/[0.14] hover:bg-white/[0.04] transition-all"
          >
            Sign in
          </button>
          <button
            onClick={go}
            className="h-[34px] px-4 text-[13px] font-medium rounded-[10px] bg-[#e8e6e1] text-[#111110] hover:bg-[#f0ede8] hover:-translate-y-px transition-all"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col">

        {/* Hero */}
        <section className="flex flex-col items-center text-center px-6 pt-[100px] pb-20">

          {/* Badge */}
          <div className="fade-up fade-up-1 inline-flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.09] rounded-full px-3.5 py-[5px] mb-9">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8e6e1]/45 inline-block" />
            <span className="text-[12px] text-[#e8e6e1]/45 tracking-widest">Real-time collaboration</span>
          </div>

          {/* Headline */}
          <h1 className="serif fade-up fade-up-2 font-normal leading-[1.1] tracking-tight text-[#e8e6e1] max-w-[660px] mb-[22px]"
            style={{ fontSize: "clamp(42px, 7vw, 72px)" }}>
            A quieter way to{" "}
            <span className="italic text-[#e8e6e1]/60">talk together</span>
          </h1>

          {/* Sub */}
          <p className="fade-up fade-up-3 text-[16px] text-[#e8e6e1]/[0.38] max-w-[420px] leading-[1.7] mb-10 font-light">
            Create a room, share the code, and everyone's in.
            No setup, no noise — just focused conversation.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4 flex gap-2.5 flex-wrap justify-center">
            <button
              onClick={go}
              className="h-[42px] px-[22px] text-[13.5px] font-medium rounded-[10px] bg-[#e8e6e1] text-[#111110] hover:bg-[#f0ede8] hover:-translate-y-px transition-all"
            >
              Create a room
            </button>
            <button
              onClick={go}
              className="h-[42px] px-[22px] text-[13.5px] font-normal rounded-[10px] border border-white/[0.08] bg-transparent text-[#e8e6e1]/45 hover:text-[#e8e6e1]/80 hover:border-white/[0.14] hover:bg-white/[0.04] transition-all"
            >
              Sign in
            </button>
          </div>
        </section>

        {/* Chat Mockup */}
        <div className="fade-up fade-up-5 flex justify-center px-6 pb-20">
          <div className="w-full max-w-[480px] bg-white/[0.025] border border-white/[0.08] rounded-[18px] overflow-hidden">

            {/* Mockup header */}
            <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-[30px] h-[30px] rounded-lg bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-[12px] text-[#e8e6e1]/40">
                  D
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#e8e6e1]/80 leading-none">design-team</p>
                  <p className="text-[11px] text-[#e8e6e1]/30 mt-[3px]">3 online</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {["A", "R", "M"].map((l) => (
                  <div key={l} className="w-6 h-6 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center text-[9px] text-[#e8e6e1]/50">
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 px-[18px] py-5">
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center text-[9px] text-[#e8e6e1]/50 shrink-0">R</div>
                <div>
                  <p className="text-[10px] text-[#e8e6e1]/30 mb-1 pl-0.5">Rin</p>
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl rounded-bl-[4px] px-3.5 py-2.5 text-[13px] text-[#e8e6e1]/70 max-w-[200px] leading-relaxed">
                    Hey — just pushed the new branch
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#e8e6e1]/10 border border-white/10 rounded-xl rounded-br-[4px] px-3.5 py-2.5 text-[13px] text-[#e8e6e1]/85 max-w-[200px] leading-relaxed">
                  Nice, reviewing now 👀
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center text-[9px] text-[#e8e6e1]/50 shrink-0">M</div>
                <div>
                  <p className="text-[10px] text-[#e8e6e1]/30 mb-1 pl-0.5">Marc</p>
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl rounded-bl-[4px] px-3.5 py-2.5 text-[13px] text-[#e8e6e1]/70 max-w-[200px] leading-relaxed">
                    Should we sync at 3pm?
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#e8e6e1]/10 border border-white/10 rounded-xl rounded-br-[4px] px-3.5 py-2.5 text-[13px] text-[#e8e6e1]/85 max-w-[200px] leading-relaxed">
                  Works for me 👍
                </div>
              </div>
            </div>

            {/* Input mock */}
            <div className="flex items-center gap-2.5 px-[18px] py-3 border-t border-white/[0.06]">
              <div className="flex-1 h-9 bg-white/[0.04] border border-white/[0.07] rounded-[9px] flex items-center pl-3">
                <span className="text-[12px] text-[#e8e6e1]/20">Message design-team…</span>
              </div>
              <div className="w-9 h-9 bg-[#e8e6e1]/10 rounded-[9px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#e8e6e1]/40" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06]" />

        {/* Features */}
        <section className="px-8 py-20">
          <div className="max-w-[900px] mx-auto">
            <p className="text-[12px] tracking-[0.1em] uppercase text-[#e8e6e1]/25 text-center mb-12">
              Why Halo
            </p>
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {[
                {
                  icon: "✦",
                  title: "Instant rooms",
                  desc: "One click to create. Share a five-character code and anyone can join — no account required.",
                },
                {
                  icon: "◈",
                  title: "Live messages",
                  desc: "Every message appears immediately. No polling, no reload. Your conversation just flows.",
                },
                {
                  icon: "◇",
                  title: "Nothing extra",
                  desc: "No notification storms, no plugins, no 47-step onboarding. Rooms, people, messages.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white/[0.025] border border-white/[0.07] rounded-[14px] p-7 hover:bg-white/[0.045] hover:border-white/[0.11] transition-all"
                >
                  <div className="w-8 h-8 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center text-[13px] text-[#e8e6e1]/40 mb-[18px]">
                    {f.icon}
                  </div>
                  <p className="text-[14px] font-medium text-[#e8e6e1]/80 mb-2">{f.title}</p>
                  <p className="text-[13px] text-[#e8e6e1]/35 leading-[1.65]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-white/[0.06]" />

        {/* Bottom CTA */}
        <section className="px-6 py-[100px] text-center">
          <h2
            className="serif font-normal tracking-tight text-[#e8e6e1] mb-3.5 leading-[1.15]"
            style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
          >
            Start a conversation
          </h2>
          <p className="text-[14px] text-[#e8e6e1]/30 mb-9 font-light">
            Free forever. No credit card.
          </p>
          <button
            onClick={go}
            className="h-[46px] px-[30px] text-[14px] font-medium rounded-[10px] bg-[#e8e6e1] text-[#111110] hover:bg-[#f0ede8] hover:-translate-y-px transition-all"
          >
            Create your first room
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 py-5 border-t border-white/[0.06]">
        <span className="text-[13px] font-medium text-[#e8e6e1]/30">Halo</span>
        <span className="text-[12px] text-[#e8e6e1]/[0.18]">Simple. Fast. Yours.</span>
      </footer>
    </div>
  );
}