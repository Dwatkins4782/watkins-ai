"use client";
import { useState, useEffect } from "react";

const KEY = "ecrh_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setTimeout(() => setVisible(true), 900); }
    catch {}
  }, []);

  function save(a: boolean, m: boolean) {
    try { localStorage.setItem(KEY, JSON.stringify({ essential: true, analytics: a, marketing: m, ts: Date.now() })); } catch {}
    if (a) window.dispatchEvent(new CustomEvent("cookie:analytics-granted"));
    if (m) window.dispatchEvent(new CustomEvent("cookie:marketing-granted"));
    setVisible(false);
  }

  if (!visible) return null;

  const toggleStyle = (on: boolean): React.CSSProperties => ({
    position: "relative" as const, width: 36, height: 20, borderRadius: 10,
    background: on ? "#6366f1" : "rgba(255,255,255,0.1)",
    border: "none", cursor: "pointer", flexShrink: 0, transition: "background 0.2s"
  });

  return (
    <div style={{ position: "fixed" as const, bottom: 0, left: 0, right: 0, zIndex: 9999, padding: "16px 20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "rgba(18,18,22,0.97)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 24px", boxShadow: "0 -8px 40px rgba(0,0,0,0.4)", fontFamily: "'Sora', sans-serif" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🍪</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#fafafa", marginBottom: 4 }}>We use cookies</p>
            <p style={{ fontSize: 13, color: "rgba(161,161,170,0.9)", lineHeight: 1.6 }}>
              Essential cookies keep the platform running. Optional analytics and marketing cookies help us improve.{" "}
              <a href="/privacy#7-cookies" style={{ color: "#818cf8", textDecoration: "none" }}>Cookie Policy</a>
            </p>
          </div>
        </div>

        {expanded && (
          <div style={{ marginBottom: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {[
              { label: "Essential", desc: "Required for authentication and core features. Cannot be disabled.", value: true, disabled: true, onChange: () => {} },
              { label: "Analytics", desc: "Understand how the platform is used so we can improve it.", value: analytics, disabled: false, onChange: () => setAnalytics(v => !v) },
              { label: "Marketing", desc: "Measure the effectiveness of our ad campaigns.", value: marketing, disabled: false, onChange: () => setMarketing(v => !v) },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <button role="switch" aria-checked={row.value} disabled={row.disabled} onClick={row.onChange} style={{ ...toggleStyle(row.value), opacity: row.disabled ? 0.5 : 1, cursor: row.disabled ? "not-allowed" : "pointer", marginTop: 2 }}>
                  <span style={{ position: "absolute" as const, top: 3, left: row.value ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                </button>
                <div><p style={{ fontSize: 13, fontWeight: 600, color: "#fafafa", marginBottom: 2 }}>{row.label}</p><p style={{ fontSize: 12, color: "rgba(161,161,170,0.8)" }}>{row.desc}</p></div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10, alignItems: "center" }}>
          <button onClick={() => save(true, true)} style={{ padding: "9px 20px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Accept all</button>
          <button onClick={() => save(false, false)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#fafafa", fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Reject optional</button>
          {expanded
            ? <button onClick={() => save(analytics, marketing)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#fafafa", fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Save preferences</button>
            : <button onClick={() => setExpanded(true)} style={{ fontSize: 13, color: "rgba(161,161,170,0.8)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "9px 0", fontFamily: "'Sora', sans-serif" }}>Customize</button>
          }
        </div>
      </div>
    </div>
  );
}
