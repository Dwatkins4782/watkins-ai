import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Watkins AI</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, company name, and payment information when you create an account or subscribe to our services.</p>
            <p className="mt-2">When you connect your e-commerce store, we access product listings, order data, customer information, and website content necessary to provide our AI-powered analysis and optimization services. This data is processed securely and used solely to deliver our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our AI-powered e-commerce growth services</li>
              <li>Generate insights, recommendations, and automated marketing campaigns for your store</li>
              <li>Process payments and manage your subscription</li>
              <li>Send transactional emails (account updates, billing, security alerts)</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. Platform API credentials are stored with additional encryption layers. We conduct regular security audits and maintain SOC 2 compliance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Sharing</h2>
            <p>We do not sell, trade, or share your personal information or store data with third parties for marketing purposes. We may share data with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service providers who assist in delivering our services (payment processing, email delivery, cloud hosting)</li>
              <li>Legal authorities when required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. AI Data Processing</h2>
            <p>Your store data is processed by our AI systems to generate insights, recommendations, and optimized content. We do not use your individual store data to train general AI models. Your data remains isolated within your tenant environment and is used exclusively to improve your specific results.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>We retain your data for as long as your account is active. Upon account deletion, we remove your personal data and store data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., billing records).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, export, or delete your personal data at any time. You can manage most of these actions from your account settings. For data export or deletion requests, contact us at privacy@watkinsai.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:privacy@watkinsai.com" className="text-primary hover:underline">privacy@watkinsai.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
