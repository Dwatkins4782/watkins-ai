import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security — EcomRevHub",
  description: "How EcomRevHub protects your data and platform security.",
};

const navStyle: React.CSSProperties = { position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" };
const linkStyle: React.CSSProperties = { color: "var(--accent-primary)", textDecoration: "none" };

export default function SecurityPage() {
  const pillars = [
    { icon: "🔒", title: "Encryption in transit", body: "All data travels over TLS 1.3. Older cipher suites (TLS 1.0/1.1) are disabled." },
    { icon: "🗄️", title: "Encryption at rest", body: "All database data is encrypted with AES-256. OAuth tokens and API credentials receive an additional application-layer encryption pass before storage." },
    { icon: "🔑", title: "Authentication", body: "Passwords are hashed with bcrypt (cost factor 12). Session tokens are short-lived JWTs stored in HttpOnly, Secure, SameSite=Strict cookies. Google OAuth is available for passwordless sign-in." },
    { icon: "🛡️", title: "Access controls", body: "Production database access requires VPN + MFA and is fully logged. All internal access to customer data follows least-privilege principles and requires a documented reason." },
    { icon: "🚦", title: "Rate limiting & bot protection", body: "All API endpoints are rate-limited. Auth endpoints include Cloudflare Turnstile bot protection. Unusual usage patterns trigger automatic alerts." },
    { icon: "🌐", title: "Infrastructure", body: "Backend runs on Railway with environment-isolated secrets. Frontend deploys on Vercel with Cloudflare edge DDoS protection. Secrets are environment-variable-only — never committed to source." },
    { icon: "🤖", title: "AI data handling", body: "Content submitted for AI analysis is sent to Azure OpenAI Services. Microsoft contractually commits that your data is not used to train foundation models. We send minimum necessary data per call." },
    { icon: "🔔", title: "Incident response", body: "We maintain an internal incident response runbook. In the event of a confirmed breach affecting user rights, we will notify affected users and regulators within 72 hours per GDPR requirements." },
  ];

  const compliance = [
    { label: "GDPR", status: "compliant", note: "Privacy controls in place. DPA available on request. Data subject request process active." },
    { label: "CCPA", status: "compliant", note: "California consumers may submit requests to privacy@ecomrevhub.com. We do not sell personal data." },
    { label: "PCI DSS", status: "compliant", note: "We do not store, process, or transmit raw card data. All payments handled by Stripe (PCI Level 1 certified)." },
    { label: "SOC 2 Type II", status: "in-progress", note: "Actively pursuing SOC 2 Type II certification. Expected completion: Q4 2026." },
    { label: "TLS 1.3", status: "compliant", note: "All connections enforced over TLS 1.3. TLS 1.0 and 1.1 are disabled." },
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
        <div style={{ textAlign: "center" as const, marginBottom: 64 }}>
          <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--accent-primary)" }}>Trust & Safety</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>Security at EcomRevHub</h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>We treat your store data and business intelligence with the same seriousness you do.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16, marginBottom: 48 }}>
          {pillars.map((p) => (
            <div key={p.title} style={{ padding: 24, borderRadius: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{p.body}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: 32, borderRadius: 20, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Compliance status</h2>
          {compliance.map((c) => {
            const badgeColor = c.status === "compliant" ? { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)" } : { bg: "rgba(234,179,8,0.1)", color: "#eab308", border: "rgba(234,179,8,0.2)" };
            const badgeLabel = c.status === "compliant" ? "Compliant" : "In progress";
            return (
              <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ width: 100, flexShrink: 0, fontSize: 14, fontWeight: 600 }}>{c.label}</div>
                <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: badgeColor.bg, color: badgeColor.color, border: `1px solid ${badgeColor.border}`, flexShrink: 0 }}>{badgeLabel}</span>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{c.note}</p>
              </div>
            );
          })}
        </div>

        <div style={{ padding: 32, borderRadius: 20, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Responsible disclosure</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>We welcome security researchers. If you discover a vulnerability, please report it privately before public disclosure. We commit to:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
            {["Acknowledge receipt within 2 business days","Provide status updates during investigation","Credit researchers who follow responsible disclosure (with their permission)","Not pursue legal action against good-faith researchers"].map((i) => (
              <li key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 6 }}>✓ {i}</li>
            ))}
          </ul>
          <a href="mailto:security@ecomrevhub.com" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Report a vulnerability →</a>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap" as const, gap: 24, fontSize: 14 }}>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
          <a href="/terms" style={linkStyle}>Terms of Service</a>
          <a href="/contact" style={linkStyle}>Contact</a>
          <a href="/" style={linkStyle}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
