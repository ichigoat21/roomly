"use client";

import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export default function LandingPage({
  onGetStarted = () => {},
  onSignIn = () => {},
}: LandingPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#111110",
        fontFamily: "'Geist', 'DM Sans', sans-serif",
        color: "#e8e6e1",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fade-up-1 { animation-delay: 0ms; }
        .fade-up-2 { animation-delay: 80ms; }
        .fade-up-3 { animation-delay: 160ms; }
        .fade-up-4 { animation-delay: 240ms; }
        .fade-up-5 { animation-delay: 320ms; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .feature-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 28px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.11);
        }

        .soft-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .btn-primary {
          background: #e8e6e1;
          color: #111110;
          border: none;
          height: 42px;
          padding: 0 22px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          font-family: inherit;
        }
        .btn-primary:hover {
          background: #f0ede8;
          transform: translateY(-1px);
        }

        .btn-ghost {
          background: transparent;
          color: rgba(232,230,225,0.45);
          border: 1px solid rgba(255,255,255,0.08);
          height: 42px;
          padding: 0 22px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 400;
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
          font-family: inherit;
        }
        .btn-ghost:hover {
          color: rgba(232,230,225,0.8);
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
        }

        .mockup-bubble {
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.5;
          max-width: 200px;
        }
        .bubble-left {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(232,230,225,0.7);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .bubble-right {
          background: rgba(232,230,225,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(232,230,225,0.85);
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .avatar-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: rgba(232,230,225,0.5);
          flex-shrink: 0;
        }

        .online-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(232,230,225,0.5);
        }
      `}</style>

      {/* ── Soft background radial warmth ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,185,160,0.06) 0%, transparent 70%)",
      }} />

      {/* ── Nav ── */}
      <header style={{
        position: "relative", zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 32px",
        height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", color: "#e8e6e1" }}>
          Halo
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className="btn-ghost" style={{ height: "34px", padding: "0 16px", fontSize: "13px" }} onClick={onSignIn}>
            Sign in
          </button>
          <button className="btn-primary" style={{ height: "34px", padding: "0 16px", fontSize: "13px" }} onClick={onGetStarted}>
            Get started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <main style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
        <section style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "100px 24px 80px",
        }}>

          {/* Pill badge */}
          <div className="fade-up fade-up-1" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "100px",
            padding: "5px 14px",
            marginBottom: "36px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(232,230,225,0.45)", display: "inline-block" }} />
            <span style={{ fontSize: "12px", color: "rgba(232,230,225,0.45)", letterSpacing: "0.04em" }}>
              Real-time collaboration
            </span>
          </div>

          {/* Headline */}
          <h1
            className="fade-up fade-up-2"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#e8e6e1",
              maxWidth: "660px",
              marginBottom: "22px",
            }}
          >
            A quieter way to{" "}
            <span style={{ fontStyle: "italic", color: "rgba(232,230,225,0.6)" }}>talk together</span>
          </h1>

          {/* Sub */}
          <p
            className="fade-up fade-up-3"
            style={{
              fontSize: "16px",
              color: "rgba(232,230,225,0.38)",
              maxWidth: "420px",
              lineHeight: 1.7,
              marginBottom: "40px",
              fontWeight: 300,
            }}
          >
            Create a room, share the code, and everyone's in.
            No setup, no noise — just focused conversation.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4" style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary" onClick={onGetStarted}>
              Create a room
            </button>
            <button className="btn-ghost" onClick={onSignIn}>
              Sign in
            </button>
          </div>
        </section>

        {/* ── Chat Mockup ── */}
        <div className="fade-up fade-up-5" style={{ display: "flex", justifyContent: "center", padding: "0 24px 80px" }}>
          <div style={{
            width: "100%", maxWidth: "480px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            overflow: "hidden",
          }}>
            {/* Mockup header */}
            <div style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "rgba(232,230,225,0.4)",
                }}>D</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(232,230,225,0.8)", lineHeight: 1 }}>design-team</p>
                  <p style={{ fontSize: "11px", color: "rgba(232,230,225,0.3)", marginTop: "3px" }}>3 online</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["A","R","M"].map((l) => (
                  <div key={l} className="avatar-dot">{l}</div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{
              padding: "20px 18px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div className="avatar-dot">R</div>
                <div>
                  <p style={{ fontSize: "10px", color: "rgba(232,230,225,0.3)", marginBottom: "4px", paddingLeft: "2px" }}>Rin</p>
                  <div className="mockup-bubble bubble-left">Hey — just pushed the new branch</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="mockup-bubble bubble-right">Nice, reviewing now 👀</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div className="avatar-dot">M</div>
                <div>
                  <p style={{ fontSize: "10px", color: "rgba(232,230,225,0.3)", marginBottom: "4px", paddingLeft: "2px" }}>Marc</p>
                  <div className="mockup-bubble bubble-left">Should we sync at 3pm?</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="mockup-bubble bubble-right">Works for me 👍</div>
              </div>
            </div>

            {/* Input mock */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 18px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                flex: 1, height: "36px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "9px",
                display: "flex", alignItems: "center", paddingLeft: "12px",
              }}>
                <span style={{ fontSize: "12px", color: "rgba(232,230,225,0.2)" }}>Message design-team…</span>
              </div>
              <div style={{
                width: "36px", height: "36px",
                background: "rgba(232,230,225,0.1)",
                borderRadius: "9px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: "14px", height: "14px", color: "rgba(232,230,225,0.4)" }} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* ── Features ── */}
        <section style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <p style={{
              fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(232,230,225,0.25)", textAlign: "center", marginBottom: "48px",
            }}>
              Why Halo
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
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
                <div key={f.title} className="feature-card">
                  <div style={{
                    width: "32px", height: "32px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", color: "rgba(232,230,225,0.4)",
                    marginBottom: "18px",
                  }}>
                    {f.icon}
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "rgba(232,230,225,0.8)", marginBottom: "8px" }}>
                    {f.title}
                  </p>
                  <p style={{ fontSize: "13px", color: "rgba(232,230,225,0.35)", lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* ── CTA ── */}
        <section style={{ padding: "100px 24px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#e8e6e1",
            marginBottom: "14px",
            lineHeight: 1.15,
          }}>
            Start a conversation
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(232,230,225,0.3)", marginBottom: "36px", fontWeight: 300 }}>
            Free forever. No credit card.
          </p>
          <button className="btn-primary" style={{ height: "46px", padding: "0 30px", fontSize: "14px" }} onClick={onGetStarted}>
            Create your first room
          </button>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(232,230,225,0.3)" }}>Halo</span>
        <span style={{ fontSize: "12px", color: "rgba(232,230,225,0.18)" }}>Simple. Fast. Yours.</span>
      </footer>
    </div>
  );
}