import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Mail,
  MessageSquare,
  Sparkles,
  ShoppingCart,
  Target,
  Wrench,
  Zap,
} from 'lucide-react'

const floatingIcons = [
  { icon: Mail, label: 'Email', x: 'left-[8%]', y: 'top-[18%]', delay: '' },
  { icon: BarChart3, label: 'Analytics', x: 'right-[10%]', y: 'top-[14%]', delay: 'animation-delay-1000' },
  { icon: MessageSquare, label: 'Support', x: 'left-[5%]', y: 'bottom-[28%]', delay: 'animation-delay-2000' },
  { icon: ShoppingCart, label: 'Store', x: 'right-[6%]', y: 'bottom-[24%]', delay: 'animation-delay-600' },
]

const stats = [
  { value: '83%', label: 'Revenue Growth' },
  { value: '10min', label: 'Campaign Launch' },
  { value: '8+', label: 'AI Modules' },
  { value: '24/7', label: 'AI Automation' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/60 via-white to-white" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/40 to-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-sky-100/30 to-cyan-50/20 rounded-full blur-3xl" />
      </div>

      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.x} ${item.y} hidden lg:flex animate-float ${item.delay}`}
        >
          <div className="bg-white shadow-lg shadow-gray-200/50 rounded-2xl p-3 border border-gray-100">
            <item.icon className="w-5 h-5 text-cyan-600" />
          </div>
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-sm font-medium mb-8 animate-fade-in-up">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered E-commerce Growth Engine
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto animate-fade-in-up animation-delay-200" style={{ opacity: 0 }}>
          Grow your store on{' '}
          <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            autopilot
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400" style={{ opacity: 0 }}>
          Replace 8 disconnected tools with one intelligent platform. Watkins AI analyzes, markets,
          optimizes, and supports your e-commerce business around the clock.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600" style={{ opacity: 0 }}>
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20"
          >
            Start Free 14-Day Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500 animate-fade-in-up animation-delay-600" style={{ opacity: 0 }}>
          No credit card required. Cancel anytime.
        </p>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-600" style={{ opacity: 0 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
