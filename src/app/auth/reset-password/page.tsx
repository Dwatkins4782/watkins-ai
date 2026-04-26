"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, background: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" as const };

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== confirm) { setError("Passwords do not match."); return; }
    if (!token) { setError("Invalid or expired link. Please request a new one."); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, newPassword: pw }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Reset failed. The link may have expired."); }
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  if (!token) return (
    <div style={{ textAlign: "center" as const }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Invalid reset link</h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>This link is missing a token. Please request a new one.</p>
      <a href="/auth/forgot-password" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", textDecoration: "none", fontWeight: 600 }}>Request new link</a>
    </div>
  );

  return success ? (
    <div style={{ textAlign: "center" as const }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Password updated!</h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Redirecting you to login...</p>
    </div>
  ) : (
    <>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Set a new password</h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28 }}>Choose a strong password for your account.</p>
      {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, marginBottom: 20 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>New password</label>
          <input type="password" required minLength={8} value={pw} onChange={e => setPw(e.target.value)} placeholder="At least 8 characters" style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor=""} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Confirm password</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor=""} />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Updating..." : "Update password"}</button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifyContent: "center", marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>E</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>EcomRevHub</span>
        </a>
        <div style={{ background: "rgba(28,28,32,0.6)", backdropFilter: "blur(16px)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: "40px 36px" }}>
          <Suspense fallback={<p style={{ color: "var(--text-secondary)" }}>Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
