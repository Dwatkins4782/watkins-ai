import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EcomRevHub",
  description: "How EcomRevHub collects, uses, and protects your personal data.",
};

const UPDATED = "April 26, 2026";
const CONTACT = "privacy@ecomrevhub.com";

const navStyle: React.CSSProperties = { position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" };
const linkStyle: React.CSSProperties = { color: "var(--accent-primary)", textDecoration: "none" };
const h2Style: React.CSSProperties = { fontSize: 20, fontWeight: 700, marginTop: 40, marginBottom: 12, color: "var(--text-primary)" };
const pStyle: React.CSSProperties = { fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 12 };
const liStyle: React.CSSProperties = { fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 8 };

export default function PrivacyPage() {
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

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--accent-primary)" }}>Legal</div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <p style={{ ...pStyle, marginBottom: 48 }}>Last updated: {UPDATED}</p>

        <p style={pStyle}>EcomRevHub ("we," "us," or "our") operates ecomrevhub.com and the EcomRevHub platform (the "Service"). This Privacy Policy explains how we collect, use, and protect your information. By using the Service, you agree to these terms.</p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Information you provide:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}><strong>Account:</strong> First name, last name, email, company name, and password.</li>
          <li style={liStyle}><strong>Billing:</strong> Payment data processed securely by Stripe. We never store raw card numbers.</li>
          <li style={liStyle}><strong>Store connections:</strong> OAuth tokens for Shopify, WooCommerce, BigCommerce, etc. Stored encrypted.</li>
          <li style={liStyle}><strong>Support:</strong> Messages you send to our team.</li>
        </ul>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Collected automatically:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}>Usage data: pages visited, features used, AI actions taken, session duration.</li>
          <li style={liStyle}>Device data: IP address, browser type, OS, referring URL.</li>
          <li style={liStyle}>Cookies: session tokens, preferences, analytics identifiers. See Section 7.</li>
        </ul>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}>To create and manage your account and deliver the Service.</li>
          <li style={liStyle}>To process payments via Stripe and send billing receipts.</li>
          <li style={liStyle}>To generate AI-powered insights and execute autonomous agent actions on your behalf.</li>
          <li style={liStyle}>To send transactional emails (confirmations, password resets, usage alerts).</li>
          <li style={liStyle}>To send marketing emails — you may opt out at any time.</li>
          <li style={liStyle}>To improve Service performance, security, and reliability.</li>
          <li style={liStyle}>To comply with legal obligations.</li>
        </ul>

        <h2 style={h2Style}>3. Legal Bases (GDPR)</h2>
        <p style={pStyle}>For EEA/UK/Swiss users: <strong>Contract performance</strong> (delivering the Service), <strong>Legitimate interests</strong> (security, improvement), <strong>Consent</strong> (marketing, non-essential cookies), and <strong>Legal obligation</strong> where required.</p>

        <h2 style={h2Style}>4. Third-Party Processors</h2>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 14, marginBottom: 16 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ textAlign: "left" as const, padding: "10px 12px", color: "var(--text-primary)" }}>Provider</th>
                <th style={{ textAlign: "left" as const, padding: "10px 12px", color: "var(--text-primary)" }}>Purpose</th>
                <th style={{ textAlign: "left" as const, padding: "10px 12px", color: "var(--text-primary)" }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {[["Stripe","Payment processing","USA"],["Microsoft Azure / Azure OpenAI","AI processing","USA / EU"],["Railway","Backend hosting","USA"],["Vercel","Frontend hosting","USA / EU"],["Email provider (Postmark/SendGrid)","Transactional email","USA"],["Analytics provider","Usage analytics","USA"]].map(([p,pu,l]) => (
                <tr key={p} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{p}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{pu}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={pStyle}>We do not sell your personal data to any third party for advertising purposes.</p>

        <h2 style={h2Style}>5. Data Retention</h2>
        <p style={pStyle}>We retain your account data while your account is active. After cancellation, data is held 90 days for recovery, then permanently deleted. Billing records are retained 7 years per tax law. Request earlier deletion at <a href={`mailto:${CONTACT}`} style={linkStyle}>{CONTACT}</a>.</p>

        <h2 style={h2Style}>6. Your Rights</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}><strong>Access:</strong> Request a copy of your personal data.</li>
          <li style={liStyle}><strong>Correction:</strong> Request correction of inaccurate data.</li>
          <li style={liStyle}><strong>Deletion:</strong> Request deletion ("right to be forgotten").</li>
          <li style={liStyle}><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
          <li style={liStyle}><strong>Objection / Restriction:</strong> Object to or restrict certain processing.</li>
          <li style={liStyle}><strong>CCPA (California):</strong> Opt out of the sale or sharing of personal information. We do not sell personal information.</li>
        </ul>
        <p style={pStyle}>Email <a href={`mailto:${CONTACT}`} style={linkStyle}>{CONTACT}</a> with subject "Privacy Request." We respond within 30 days.</p>

        <h2 style={h2Style}>7. Cookies</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}><strong>Essential:</strong> Required for authentication. Cannot be disabled.</li>
          <li style={liStyle}><strong>Analytics:</strong> Help us understand usage. Require consent.</li>
          <li style={liStyle}><strong>Marketing:</strong> Measure ad effectiveness. Require consent.</li>
        </ul>
        <p style={pStyle}>Manage preferences via the cookie banner on your first visit.</p>

        <h2 style={h2Style}>8. Security</h2>
        <p style={pStyle}>We use TLS 1.3 for data in transit and AES-256 for data at rest. Access controls, regular security reviews, and short-lived session tokens protect your account. In the event of a breach affecting your rights, we will notify you as required by law.</p>

        <h2 style={h2Style}>9. International Transfers</h2>
        <p style={pStyle}>Your data may be processed in the United States. For EEA/UK users we rely on Standard Contractual Clauses or equivalent mechanisms. Contact us for a copy.</p>

        <h2 style={h2Style}>10. Children</h2>
        <p style={pStyle}>The Service is not directed to individuals under 18. We do not knowingly collect data from children. If we become aware of such collection, we will delete it promptly.</p>

        <h2 style={h2Style}>11. Changes</h2>
        <p style={pStyle}>We may update this policy. For material changes, we will email registered users 30 days before they take effect.</p>

        <h2 style={h2Style}>12. Contact</h2>
        <div style={{ padding: 24, borderRadius: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
          <p style={{ ...pStyle, marginBottom: 4, fontWeight: 600, color: "var(--text-primary)" }}>EcomRevHub Privacy</p>
          <p style={{ ...pStyle, marginBottom: 0 }}>Email: <a href={`mailto:${CONTACT}`} style={linkStyle}>{CONTACT}</a></p>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap" as const, gap: 24, fontSize: 14, color: "var(--text-tertiary)" }}>
          <a href="/terms" style={linkStyle}>Terms of Service</a>
          <a href="/security" style={linkStyle}>Security</a>
          <a href="/contact" style={linkStyle}>Contact</a>
          <a href="/" style={linkStyle}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
