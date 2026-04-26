import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — EcomRevHub",
  description: "Terms governing your use of the EcomRevHub platform.",
};

const UPDATED = "April 26, 2026";
const navStyle: React.CSSProperties = { position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" };
const linkStyle: React.CSSProperties = { color: "var(--accent-primary)", textDecoration: "none" };
const h2Style: React.CSSProperties = { fontSize: 20, fontWeight: 700, marginTop: 40, marginBottom: 12, color: "var(--text-primary)" };
const pStyle: React.CSSProperties = { fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 12 };
const liStyle: React.CSSProperties = { fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 8 };

export default function TermsPage() {
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
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <p style={{ ...pStyle, marginBottom: 48 }}>Last updated: {UPDATED}</p>

        <p style={pStyle}>These Terms of Service ("Terms") govern your use of EcomRevHub ("Service"). By creating an account, you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>

        <h2 style={h2Style}>1. Eligibility</h2>
        <p style={pStyle}>You must be at least 18 years old to use the Service. By using it, you represent you meet this requirement. If using on behalf of a business, you represent you have authority to bind that entity.</p>

        <h2 style={h2Style}>2. Account & Security</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}>Provide accurate and complete registration information.</li>
          <li style={liStyle}>Maintain confidentiality of your login credentials.</li>
          <li style={liStyle}>Notify us immediately at support@ecomrevhub.com of any unauthorized access.</li>
          <li style={liStyle}>You may not share your account or create accounts for others without authorization.</li>
        </ul>

        <h2 style={h2Style}>3. Subscription & Billing</h2>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Free Trial:</p>
        <p style={pStyle}>14-day trials are available to new accounts only. If you do not cancel before the trial ends, your paid subscription begins automatically.</p>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Payment:</p>
        <p style={pStyle}>All fees are billed in USD via Stripe, in advance, monthly or annually per your selection. All charges are non-refundable except as stated below.</p>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Plan Changes:</p>
        <p style={pStyle}>Upgrades take effect immediately (prorated). Downgrades take effect at the next billing cycle.</p>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Refunds:</p>
        <p style={pStyle}>We do not offer refunds for partial months or unused features. Billing errors must be reported within 30 days to support@ecomrevhub.com.</p>
        <p style={{ ...pStyle, fontWeight: 600, color: "var(--text-primary)" }}>Price Changes:</p>
        <p style={pStyle}>We may change prices with 30 days' notice. Continued use constitutes acceptance of new pricing.</p>

        <h2 style={h2Style}>4. Acceptable Use</h2>
        <p style={pStyle}>You agree not to:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
          <li style={liStyle}>Violate any applicable law or third-party rights.</li>
          <li style={liStyle}>Use the Service to distribute spam, malware, or fraudulent content.</li>
          <li style={liStyle}>Reverse-engineer, decompile, or extract source code from the Service.</li>
          <li style={liStyle}>Circumvent usage limits, authentication, or rate limits.</li>
          <li style={liStyle}>Use AI features to generate content that violates connected platform policies.</li>
          <li style={liStyle}>Resell access to the Service without written authorization (except white-label Enterprise customers).</li>
          <li style={liStyle}>Interfere with or disrupt the integrity or performance of the Service.</li>
        </ul>

        <h2 style={h2Style}>5. Your Data</h2>
        <p style={pStyle}>You retain ownership of all data you bring to the Service. By connecting a store, you grant us a limited license to access and process that data solely to deliver the Service. We do not sell your store data. You are responsible for ensuring you have the right to connect any stores or accounts.</p>

        <h2 style={h2Style}>6. AI Features & Autonomous Agents</h2>
        <p style={pStyle}>AI outputs may contain errors. You are responsible for reviewing AI-generated content before publishing. Autonomous agent actions are executed on your behalf — you bear responsibility for outcomes you authorize. We make no guarantee that AI strategies will produce specific revenue results.</p>

        <h2 style={h2Style}>7. Intellectual Property</h2>
        <p style={pStyle}>The Service, including software, design, and trademarks, is owned by EcomRevHub. These Terms do not transfer any IP rights to you. You retain ownership of content you create using the Service.</p>

        <h2 style={h2Style}>8. Disclaimers</h2>
        <p style={{ ...pStyle, fontVariant: "small-caps" }}>The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be error-free, uninterrupted, or meet your specific requirements. Revenue projections are illustrative only, not guarantees.</p>

        <h2 style={h2Style}>9. Limitation of Liability</h2>
        <p style={{ ...pStyle, fontVariant: "small-caps" }}>To the maximum extent permitted by law, EcomRevHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed amounts paid by you in the 12 months preceding the claim.</p>

        <h2 style={h2Style}>10. Indemnification</h2>
        <p style={pStyle}>You agree to indemnify and hold harmless EcomRevHub and its officers, directors, employees, and agents from any claims arising from your use of the Service in violation of these Terms, your content, or your violation of third-party rights.</p>

        <h2 style={h2Style}>11. Termination</h2>
        <p style={pStyle}>You may cancel at any time from account settings. We may suspend or terminate your account for material violation of these Terms. Data deletion follows our Privacy Policy retention schedule.</p>

        <h2 style={h2Style}>12. Governing Law & Disputes</h2>
        <p style={pStyle}>These Terms are governed by Tennessee law, USA, without regard to conflict of law principles. Disputes shall first be subject to 30 days of informal negotiation, then binding arbitration under AAA Consumer Rules. Class action waiver: disputes are resolved individually, not as a class.</p>

        <h2 style={h2Style}>13. Changes</h2>
        <p style={pStyle}>We may update these Terms with 30 days' email notice for material changes. Continued use after the effective date constitutes acceptance.</p>

        <h2 style={h2Style}>14. Contact</h2>
        <div style={{ padding: 24, borderRadius: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
          <p style={{ ...pStyle, marginBottom: 4, fontWeight: 600, color: "var(--text-primary)" }}>EcomRevHub Legal</p>
          <p style={{ ...pStyle, marginBottom: 0 }}>Email: <a href="mailto:legal@ecomrevhub.com" style={linkStyle}>legal@ecomrevhub.com</a></p>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap" as const, gap: 24, fontSize: 14 }}>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
          <a href="/security" style={linkStyle}>Security</a>
          <a href="/contact" style={linkStyle}>Contact</a>
          <a href="/" style={linkStyle}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
