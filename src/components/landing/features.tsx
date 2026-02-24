import {
  Globe,
  Mail,
  MessageSquare,
  BarChart3,
  Target,
  Headphones,
  Wrench,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Globe,
    name: 'Website Crawler & Analyzer',
    description: 'AI scans your entire site in minutes to understand brand voice, find SEO issues, and identify quick conversion wins.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Mail,
    name: 'Email Marketing Engine',
    description: 'Generate entire email sequences in your brand voice. Abandoned cart, welcome series, win-back -- all on autopilot.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: MessageSquare,
    name: 'SMS Marketing Engine',
    description: 'Reach customers with 98% open rate SMS campaigns. TCPA-compliant, behavior-triggered messaging.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: BarChart3,
    name: 'Analytics & Insights',
    description: 'Proprietary Profit Score algorithm rates your growth potential 0-100, with daily AI-generated actionable insights.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: Target,
    name: 'Product Recommendations',
    description: 'AI creates bundles, upsells, and cross-sells that increase average order value by 20-40%.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Headphones,
    name: 'Customer Support AI',
    description: 'Auto-categorize tickets, detect sentiment, and generate personalized responses. Resolve 40%+ tickets instantly.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Wrench,
    name: 'Website Optimization',
    description: 'AI rewrites product pages, meta tags, and CTAs for maximum conversions. Boost conversion rates 15-30%.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Sparkles,
    name: 'DFY Store Builder',
    description: 'Go from idea to launched store in 6-8 weeks. AI-powered branding, product curation, and complete setup.',
    color: 'bg-amber-50 text-amber-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">
            Platform
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            8 powerful modules, one platform
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Everything you need to analyze, market, optimize, and grow your e-commerce business -- powered by GPT-4o.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-100/80 hover:border-gray-200 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${feature.color}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
