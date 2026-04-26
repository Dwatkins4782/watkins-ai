"use client";
import { useState } from "react";
import type { Metadata } from "next";

const navStyle: React.CSSProperties = { position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" };
const linkStyle: React.CSSProperties = { color: "var(--accent-primary)", textDecoration: "none" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, background: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" as const };

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("https://formspree.io/f/xpwdkynv", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Submission failed. Please email us directly.");
      setSent(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  const channels = [
    { icon: "💬", title: "General Support", desc: "Questions about your account, billing, or the platform.", cta: "Email Support", href: "mailto:support@ecomrevhub.com", note: "Response within 24 hours" },
    { icon: "🚀", title: "Sales & Enterprise", desc: "Pricing for Pro/Enterprise plans, custom contracts, and white-label inquiries.", cta: "Talk to Sales", href: "mailto:sales@ecomrevhub.com", note: "Same business day", highlight: true },
    { icon: "🤝", title: "Partnerships", desc: "Agency partnerships, integrations, reseller agreements, and affiliate program.", cta: "Contact Partnerships", href: "mailto:partners@ecomrevhub.com", note: "Response within 48 hours" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "'Sora', sans-serif" }}>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white" }}>E</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>EcomRevHub</span>
          </a>
          <a href="/auth/register" style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Start Free Trial</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ textAlign: "center" as const, marginBottom: 60 }}>
          <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--accent-primary)" }}>Get in touch</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>Contact EcomRevHub</h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>We're here to help. Choose the right channel for the fastest response.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 56 }}>
          {channels.map((c) => (
            <div key={c.title} style={{ padding: 24, borderRadius: 16, background: c.highlight ? "rgba(99,102,241,0.06)" : "var(--bg-tertiary)", border: c.highlight ? "1px solid rgba(99,102,241,0.25)" : "1px solid var(--border-subtle)", display: "flex", flexDirection: "column" as const, gap: 12 }}>
              <span style={{ fontSize: 24 }}>{c.icon}</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
              <div style={{ marginTop: "auto" }}>
                <a href={c.href} style={{ display: "inline-block", padding: "10px 20px", borderRadius: 10, background: c.highlight ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "var(--bg-elevated)", color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600, border: c.highlight ? "none" : "1px solid var(--border-default)" }}>{c.cta}</a>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>{c.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 40, borderRadius: 20, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", maxWidth: 640, margin: "0 auto" }}>
          {sent ? (
            <div style={{ textAlign: "center" as const, padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Message sent!</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>We'll reply to <strong>{form.email}</strong> shortly.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Send us a message</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>We'll route your message to the right team.</p>
              {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 14, marginBottom: 20 }}>{error}</div>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Name</label><input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor=""} /></div>
                  <div><label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label><input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@company.com" style={inputStyle} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor=""} /></div>
                </div>
                <div><label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Topic</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} style={{...inputStyle, background: "var(--bg-secondary)"}}>
                    <option value="">Select a topic...</option>
                    <option value="general">General question</option>
                    <option value="sales">Sales / pricing</option>
                    <option value="billing">Billing issue</option>
                    <option value="technical">Technical support</option>
                    <option value="enterprise">Enterprise / white-label</option>
                    <option value="partnership">Partnership inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us how we can help..." style={{...inputStyle, resize: "none" as const}} onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor=""} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Sending..." : "Send message"}</button>
              </form>
            </>
          )}
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap" as const, gap: 24, fontSize: 14 }}>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
          <a href="/terms" style={linkStyle}>Terms of Service</a>
          <a href="/security" style={linkStyle}>Security</a>
          <a href="/" style={linkStyle}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
