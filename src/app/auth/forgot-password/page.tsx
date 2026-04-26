"use client";
import { useState } from "react";

const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, background: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" as const };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Something went wrong."); }
      setSent(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifyContent: "center", marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>E</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>EcomRevHub</span>
        </a>
        <div style={{ background: "rgba(28,28,32,0.6)", backdropFilter: "blur(16px)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: "40px 36px" }}>
          {sent ? (
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Check your email</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>If an account exists for <strong style={{ color: "var(--text-primary)" }}>{email}</strong>, you'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive.</p>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 24 }}>The link expires in 1 hour for your security.</p>
              <button onClick={() => { setSent(false); setEmail(""); }} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 14, fontWeight: 500, border: "1px solid var(--border-default)", cursor: "pointer", fontFamily: "'Sora', sans-serif", marginBottom: 12 }}>Try a different email</button>
              <a href="/auth/login" style={{ display: "block", textAlign: "center" as const, fontSize: 14, color: "var(--text-tertiary)", textDecoration: "none" }}>← Back to login</a>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Forgot your password?</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>
              {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, marginBottom: 20 }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourstore.com" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 24px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Sending..." : "Send reset link"}</button>
              </form>
              <div style={{ textAlign: "center" as const, marginTop: 24 }}>
                <a href="/auth/login" style={{ fontSize: 14, color: "var(--text-tertiary)", textDecoration: "none" }}>← Back to login</a>
              </div>
            </>
          )}
        </div>
        <p style={{ textAlign: "center" as const, fontSize: 14, color: "var(--text-tertiary)", marginTop: 24 }}>Don't have an account? <a href="/auth/register" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>Sign up free</a></p>
      </div>
    </div>
  );
}
