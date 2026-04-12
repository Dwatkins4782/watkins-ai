"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      window.location.href = "/auth/login?registered=true";
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); } finally { setLoading(false); }
  };

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [f]: e.target.value }));
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, background: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" as const };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifyContent: "center", marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>E</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>EcomRevHub</span>
        </a>
        <div style={{ background: "rgba(28,28,32,0.6)", backdropFilter: "blur(16px)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: "40px 36px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Create Account</h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", textAlign: "center", marginBottom: 32 }}>Start growing your e-commerce business with AI</p>
          {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, marginBottom: 20, textAlign: "center" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>First Name</label><input type="text" required value={form.firstName} onChange={update("firstName")} placeholder="John" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} /></div>
              <div><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Last Name</label><input type="text" required value={form.lastName} onChange={update("lastName")} placeholder="Doe" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} /></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label><input type="email" required value={form.email} onChange={update("email")} placeholder="john@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Company Name</label><input type="text" value={form.company} onChange={update("company")} placeholder="Your Company (optional)" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} /></div>
            <div style={{ marginBottom: 24 }}><label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Password</label><input type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = ""} /><p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6 }}>Must be at least 8 characters</p></div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 24px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.3s", opacity: loading ? 0.7 : 1 }}>{loading ? "Creating Account..." : "Create Account"}</button>
          </form>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-tertiary)", marginTop: 24 }}>Already have an account? <a href="/auth/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>Log in</a></p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24, fontSize: 12, color: "var(--text-tertiary)" }}><span>256-bit SSL</span><span>SOC 2 Compliant</span><span>14-day free trial</span></div>
      </div>
    </div>
  );
}
