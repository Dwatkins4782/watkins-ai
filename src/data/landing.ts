// AUDIT #22: Marketing data extracted from page.tsx.
// Lets us unit test, reuse on other pages, and modify content without
// touching presentation components.

export interface PricingPlan {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  cta: string;
  href: string;
  highlight?: boolean;
  platform: string[];
  ai: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "Launch your first store with AI",
    monthlyPrice: 99,
    annualPrice: 79,
    cta: "Start Free Trial",
    href: "/auth/register",
    platform: [
      "1 store connected",
      "1,000 AI actions/mo",
      "Email marketing (50/mo)",
      "Full store audit & scoring",
      "Analytics dashboard",
    ],
    ai: ["AI product recommendations", "Basic SEO audit"],
  },
  {
    name: "Growth",
    tagline: "Scale with AI agents & builder",
    monthlyPrice: 279,
    annualPrice: 223,
    badge: "Best Value",
    cta: "Start Free Trial",
    href: "/auth/register",
    platform: [
      "5 stores connected",
      "10,000 AI actions/mo",
      "Unlimited email + SMS",
      "Product optimization engine",
      "Advanced analytics",
    ],
    ai: [
      "AI Autonomous Agents (3)",
      "AI App Builder (Basic)",
      "SEO keyword tracking (50)",
      "Trend scraper",
      "Smart recommendations",
    ],
  },
  {
    name: "Professional",
    tagline: "Full AI platform, zero limits",
    monthlyPrice: 577,
    annualPrice: 461,
    badge: "Most Popular",
    cta: "Start Free Trial",
    href: "/auth/register",
    highlight: true,
    platform: [
      "15 stores connected",
      "50,000 AI actions/mo",
      "Everything in Growth",
      "Advanced analytics + reports",
    ],
    ai: [
      "All 6 AI Agents",
      "AI App Builder (Full)",
      "Full SEO suite (500 keywords)",
      "AI ad management",
      "CRM & customer management",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom AI for agencies & brands",
    monthlyPrice: 1497,
    annualPrice: 1197,
    cta: "Contact Sales",
    href: "mailto:sales@ecomrevhub.com?subject=Enterprise%20Inquiry",
    platform: [
      "Unlimited stores",
      "Unlimited AI actions",
      "Everything in Professional",
      "Enterprise analytics + BI",
    ],
    ai: [
      "All Agents + Custom agents",
      "AI Builder (Unlimited + API)",
      "Unlimited SEO keywords",
      "White-label solution",
      "Dedicated success manager",
      "Custom integrations & SLA",
    ],
  },
];

export interface FAQItem {
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
  {
    q: "How does the free trial work?",
    a: "Start with a 14-day free trial on any plan. No credit card required. You get full access to all features in your chosen tier. Cancel anytime before the trial ends and you won't be charged.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the next billing cycle.",
  },
  {
    q: "What platforms do you integrate with?",
    a: "EcomRevHub integrates with Shopify, WooCommerce, BigCommerce, Magento, Squarespace, Wix, Amazon, Etsy, and more. We also support custom integrations via our API on Enterprise plans.",
  },
  {
    q: "How do the AI Autonomous Agents work?",
    a: "Our AI agents operate as a virtual team — CEO, Growth Manager, Engineer, Marketing, Support, and Ad Manager. They analyze your data 24/7, make recommendations, and execute tasks automatically.",
  },
  {
    q: "How does the AI Dropshipping Engine work?",
    a: "The AI Dropshipping Engine connects to vetted supplier networks, identifies winning products, auto-imports them with optimized listings, syncs inventory in real-time, and automates order fulfillment.",
  },
  {
    q: "Do I need technical skills?",
    a: "Not at all. EcomRevHub is designed for entrepreneurs of all technical levels. If you can type a sentence, you can use EcomRevHub.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use AES-256 encryption at rest and TLS 1.3 in transit. We never share or sell your data. SOC 2 Type II certification is in progress — expected Q4 2026.",
  },
];

export interface AddOnPackage {
  title: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
}

export const ADD_ONS: AddOnPackage[] = [
  {
    title: "DFY Store Builder",
    price: "$4,997",
    period: "one-time",
    desc: "We build your complete store from scratch + 30 days optimization",
    features: [
      "Complete store build",
      "Product research & sourcing",
      "Brand identity & logo design",
      "30 days post-launch optimization",
      "Email marketing setup",
    ],
  },
  {
    title: "AI Agents Boost",
    price: "$299",
    period: "/mo",
    desc: "Add custom AI agents with your own prompts, goals & execution flows",
    features: [
      "3 custom agent personas",
      "Priority execution queue",
      "Advanced per-agent analytics",
      "Custom workflow builder",
      "Slack/Discord notifications",
    ],
  },
  {
    title: "Builder Pro Pack",
    price: "$199",
    period: "/mo",
    desc: "Premium templates, custom domains & priority AI generation",
    features: [
      "50+ premium templates",
      "Custom domain + SSL",
      "Priority build queue",
      "GitHub auto-sync",
      "White-label branding",
    ],
  },
  {
    title: "Ad Running Service",
    price: "$697",
    period: "/mo + ad spend",
    desc: "AI manages your ads across Google, Meta, TikTok",
    features: [
      "Multi-platform ad management",
      "AI creative generation",
      "Budget optimization & ROAS tracking",
      "Weekly performance reporting",
      "A/B testing automation",
    ],
  },
  {
    title: "SEO Growth Engine",
    price: "$497",
    period: "/mo",
    desc: "Full-service AI SEO to drive organic traffic & sales",
    features: [
      "AI content & blog generation",
      "Technical SEO monitoring",
      "Keyword research & tracking",
      "Backlink building & outreach",
      "Schema markup optimization",
    ],
  },
];
