import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Ready to grow your store on autopilot?
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Join thousands of e-commerce businesses using AI to drive revenue, save time, and
          outperform the competition.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Start Your Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          14 days free. No credit card required.
        </p>
      </div>
    </section>
  )
}
