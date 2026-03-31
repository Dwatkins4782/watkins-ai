import Link from 'next/link'
import { 
  Sparkles, ShoppingCart, Mail, BarChart3, 
  MessageSquare, Wrench, Zap, Shield, 
  ArrowRight, CheckCircle2, Star
} from 'lucide-react'

const features = [
  {
    icon: ShoppingCart,
    title: 'Website Crawler & Analyzer',
    description: 'AI scans your store and identifies conversion killers, SEO gaps, and missed revenue opportunities in minutes.',
  },
  {
    icon: Mail,
    title: 'Email & SMS Automation',
    description: 'Auto-generate welcome flows, abandoned cart sequences, and win-back campaigns that match your brand voice.',
  },
  {
    icon: BarChart3,
    title: 'Profit Score Analytics',
    description: 'Get a real-time Profit Score across 6 dimensions with actionable insights ranked by revenue impact.',
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    description: 'AI-powered cross-sells, upsells, and bundles that increase average order value automatically.',
  },
  {
    icon: MessageSquare,
    title: 'Support AI Agent',
    description: 'Resolve tickets instantly with sentiment analysis, smart responses, and seamless escalation.',
  },
  {
    icon: Wrench,
    title: 'Done-For-You Builder',
    description: 'Launch a complete e-commerce store with AI-generated branding, products, content, and marketing.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 99,
    description: 'For small stores getting started with AI',
    features: ['1 store', '500 products', '5,000 emails/mo', '500 SMS/mo', 'Basic AI insights', 'Email support'],
  },
  {
    name: 'Growth',
    price: 299,
    popular: true,
    description: 'For growing brands ready to scale',
    features: ['5 stores', '5,000 products', '25,000 emails/mo', '2,500 SMS/mo', 'Advanced analytics', 'Priority support', 'Smart recommendations'],
  },
  {
    name: 'Professional',
    price: 699,
    description: 'For established businesses maximizing profit',
    features: ['Unlimited stores', 'Unlimited products', '100,000 emails/mo', '10,000 SMS/mo', 'Custom AI models', 'Dedicated support', 'DFY store builder', 'API access'],
  },
]

const testimonials = [
  {
    quote: 'Watkins AI increased our email revenue by 340% in the first month. The AI-generated flows convert better than anything we wrote ourselves.',
    author: 'Sarah K.',
    role: 'Shopify Store Owner',
    stars: 5,
  },
  {
    quote: 'The Profit Score alone was worth the investment. We found $15K in missed revenue opportunities we never knew existed.',
    author: 'Marcus T.',
    role: 'E-commerce Director',
    stars: 5,
  },
  {
    quote: 'We launched a complete store in 48 hours using the DFY builder. Branding, products, email flows — all done by AI.',
    author: 'Jessica L.',
    role: 'Serial Entrepreneur',
    stars: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Watkins AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered E-commerce Growth Engine
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Grow your store on{' '}
            <span className="text-primary">autopilot</span> with AI
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Watkins AI analyzes your e-commerce store, generates high-converting email and SMS flows,
            optimizes product pages, and delivers actionable profit insights — all automatically.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-md border border-border px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
            >
              See How It Works
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Stores Powered</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">$2.4M+</p>
              <p className="text-sm text-muted-foreground mt-1">Revenue Generated</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">12M+</p>
              <p className="text-sm text-muted-foreground mt-1">Emails Sent</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">340%</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Revenue Lift</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to grow</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Six AI-powered modules working together to analyze, optimize, and scale your e-commerce business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-lg border border-border/60 bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="inline-flex items-center justify-center rounded-md bg-primary/10 p-2.5 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Up and running in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Connect Your Store', desc: 'Link your Shopify or WooCommerce store in one click. We securely sync your products, orders, and customers.' },
              { step: '2', title: 'AI Analyzes Everything', desc: 'Our AI crawls your site, identifies opportunities, and generates a personalized growth plan with your Profit Score.' },
              { step: '3', title: 'Watch Revenue Grow', desc: 'Automated email flows, product optimizations, and smart recommendations start working immediately.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
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
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <Link
                  href="/auth/register"
                  className={`block text-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border hover:bg-accent'
                  }`}
                >
                  Start Free Trial
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Need more? <Link href="/auth/register" className="text-primary hover:underline">Contact us</Link> for Enterprise pricing.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by store owners</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-lg border border-border/60 bg-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to grow your store?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of e-commerce brands using AI to increase revenue, reduce costs, and scale faster.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> 14-Day Free Trial
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Cancel Anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">Watkins AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered e-commerce growth engine that builds, runs, and scales your online business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@watkinsai.com" className="hover:text-foreground transition-colors">support@watkinsai.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Watkins AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
