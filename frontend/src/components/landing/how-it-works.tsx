import { Store, Scan, Rocket, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Store,
    title: 'Connect your store',
    description: 'Link your Shopify or WooCommerce store in under a minute. We sync products, orders, and customer data securely.',
  },
  {
    number: '02',
    icon: Scan,
    title: 'AI analyzes everything',
    description: 'Our crawler scans every page, extracts your brand voice, identifies SEO issues, and spots conversion opportunities.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch campaigns instantly',
    description: 'Generate email sequences, SMS flows, product bundles, and optimized content -- all in your brand voice.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Watch revenue grow',
    description: 'AI continuously optimizes everything. Track your Profit Score, read daily insights, and see measurable growth.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            No code, no setup headaches. Connect your store and let the AI take it from there.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-gradient-to-r from-cyan-200 to-gray-200" />
              )}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 mb-5">
                  <step.icon className="w-8 h-8 text-cyan-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
