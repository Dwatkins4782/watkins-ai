import Link from 'next/link'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For solo entrepreneurs testing AI automation.',
    features: [
      '1 connected store',
      '5,000 AI calls/month',
      '1,000 emails/month',
      '500 SMS/month',
      'All 8 core modules',
      'Email support (24h)',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$299',
    period: '/month',
    description: 'For growing brands ready to scale.',
    features: [
      '5 connected stores',
      '25,000 AI calls/month',
      '10,000 emails/month',
      '2,500 SMS/month',
      'All 8 core modules',
      '3 user accounts',
      'A/B testing',
      'Custom AI training',
      'Priority support (12h)',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Professional',
    price: '$699',
    period: '/month',
    description: 'For established brands and agencies.',
    features: [
      'Unlimited stores',
      '100,000 AI calls/month',
      '50,000 emails/month',
      '10,000 SMS/month',
      'All 8 core modules',
      '10 user accounts',
      'White-label branding',
      'API access',
      'Dedicated success manager',
      'Chat support (2h)',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Replace your $800/month tool stack
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            One platform, transparent pricing. 14-day free trial on every plan -- no credit card required.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? 'bg-gray-900 text-white ring-2 ring-gray-900 shadow-2xl shadow-gray-900/20 lg:scale-105'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1 rounded-full bg-cyan-500 text-white text-xs font-semibold">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className={`text-lg font-semibold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`mt-1 text-sm ${tier.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className={`text-4xl font-bold tracking-tight ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm ${tier.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tier.period}
                </span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <span className={`text-sm ${tier.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`mt-8 block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  tier.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need more?{' '}
            <span className="font-semibold text-gray-900">Enterprise plans</span>{' '}
            start at $5,000/month with unlimited everything, custom SLAs, and dedicated support.
          </p>
        </div>
      </div>
    </section>
  )
}
