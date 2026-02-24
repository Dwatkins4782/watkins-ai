import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'We went from $12K to $22K monthly revenue in just 3 months. The AI campaigns practically run themselves.',
    name: 'Sarah M.',
    role: 'Solo Entrepreneur',
    metric: '+83% Revenue',
  },
  {
    quote: 'Replaced our $800/month tool stack with one platform. Better results, less complexity, massive time savings.',
    name: 'David K.',
    role: 'DTC Brand Founder',
    metric: '$501/mo Saved',
  },
  {
    quote: 'Support response time dropped from 4 hours to 12 minutes. Our customers have never been happier.',
    name: 'Rachel T.',
    role: 'E-commerce Director',
    metric: '95% Faster Support',
  },
]

const logos = [
  'Shopify',
  'WooCommerce',
  'SendGrid',
  'Twilio',
  'Stripe',
  'GPT-4o',
]

export default function SocialProof() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">
            Results
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Real results, real growth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-gray-100 pt-12">
          <p className="text-center text-sm text-gray-500 mb-8">
            Integrates with the tools you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((name) => (
              <span
                key={name}
                className="text-base font-semibold text-gray-400 hover:text-gray-600 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
