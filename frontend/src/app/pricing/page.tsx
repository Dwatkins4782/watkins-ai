import Link from 'next/link'
import { CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Try EcomRevHub with basic features',
    features: [
      { name: '1 store', included: true },
      { name: '100 products', included: true },
      { name: '1,000 emails/mo', included: true },
      { name: '100 SMS/mo', included: true },
      { name: 'Basic Profit Score', included: true },
      { name: 'Community support', included: true },
      { name: 'AI recommendations', included: false },
      { name: 'DFY store builder', included: false },
    ],
    cta: 'Get Started',
    ctaStyle: 'border border-border hover:bg-accent',
  },
  {
    name: 'Starter',
    price: 99,
    description: 'For small stores getting started with AI',
    features: [
      { name: '1 store', included: true },
      { name: '500 products', included: true },
      { name: '5,000 emails/mo', included: true },
      { name: '500 SMS/mo', included: true },
      { name: 'Full Profit Score', included: true },
      { name: 'Email support', included: true },
      { name: 'Basic recommendations', included: true },
      { name: 'DFY store builder', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'border border-border hover:bg-accent',
  },
  {
    name: 'Growth',
    price: 299,
    popular: true,
    description: 'For growing brands ready to scale',
    features: [
      { name: '5 stores', included: true },
      { name: '5,000 products', included: true },
      { name: '25,000 emails/mo', included: true },
      { name: '2,500 SMS/mo', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Smart recommendations', included: true },
      { name: 'DFY store builder', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    name: 'Professional',
    price: 699,
    description: 'For established businesses maximizing profit',
    features: [
      { name: 'Unlimited stores', included: true },
      { name: 'Unlimited products', included: true },
      { name: '100,000 emails/mo', included: true },
      { name: '10,000 SMS/mo', included: true },
      { name: 'Custom AI models', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Full recommendations', included: true },
      { name: 'DFY store builder', included: true },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'border border-border hover:bg-accent',
  },
]

const dropshipElite = {
  name: 'Dropship Elite',
  price: 999,
  popular: false,
  description: 'Fully automated dropshipping with AI-matched suppliers, auto-fulfillment, and hands-off scaling',
  features: [
    { name: 'Everything in Professional', included: true },
    { name: 'AI-matched dropship suppliers', included: true },
    { name: 'Full Auto supplier setup', included: true },
    { name: 'Auto product import (500+)', included: true },
    { name: 'Auto-fulfillment & inventory sync', included: true },
    { name: 'Automated pricing & markup', included: true },
    { name: 'Supplier performance reviews', included: true },
    { name: 'Priority dropship support (90 days)', included: true },
  ],
  cta: 'Start Free Trial',
  ctaStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700',
}

const faqs = [
  {
    q: 'How does the 14-day free trial work?',
    a: 'Sign up for any plan and get full access for 14 days. No credit card required. If you love it, choose a plan to continue. If not, your account simply downgrades to Free.',
  },
  {
    q: 'Can I change plans at any time?',
    a: 'Yes. Upgrade or downgrade anytime from your billing dashboard. Changes are prorated so you only pay for what you use.',
  },
  {
    q: 'What e-commerce platforms do you support?',
    a: 'We currently support Shopify and WooCommerce, with more platforms coming soon. You can also use our API with any custom store.',
  },
  {
    q: 'Is my store data secure?',
    a: 'Absolutely. All data is encrypted in transit and at rest. We never share or sell your data. Platform credentials are stored with AES-256 encryption.',
  },
  {
    q: 'What happens if I exceed my plan limits?',
    a: 'We\'ll notify you when you\'re approaching limits. You can upgrade at any time. We never cut off service unexpectedly — you\'ll always get a warning first.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcomRevHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Plans & Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you&apos;re ready. Every plan includes a 14-day trial with full access.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {[...plans, dropshipElite].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 flex flex-col ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/10 relative'
                    : 'border-border/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <Link
                  href="/auth/register"
                  className={`block text-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground/60'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="rounded-lg border border-border/60 p-8 text-center">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <p className="text-muted-foreground mt-2">Custom AI models, dedicated infrastructure, SLA, and white-glove onboarding.</p>
              <Link
                href="mailto:sales@ecomrevhub.com"
                className="inline-flex items-center gap-2 mt-4 rounded-md border border-border px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border border-border/60 bg-card p-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>&copy; {new Date().getFullYear()} EcomRevHub</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
