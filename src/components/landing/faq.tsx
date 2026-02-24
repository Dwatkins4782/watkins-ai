'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Do I need to know how to code?',
    answer: 'Not at all. Watkins AI is completely no-code. Just connect your store, and the AI handles everything from campaign generation to page optimization.',
  },
  {
    question: 'How long does it take to see results?',
    answer: 'Most customers see improvements within 30 days. Email campaigns launch in 10 minutes, and the support AI reduces response time immediately after activation.',
  },
  {
    question: 'Will the AI replace my marketing team?',
    answer: 'No -- it augments them. The AI handles repetitive tasks like email copywriting, ticket responses, and SEO optimization so your team can focus on strategy and creative work.',
  },
  {
    question: 'What if the AI generates bad content?',
    answer: 'All AI-generated content can be reviewed and edited before going live. The platform learns from your edits and improves over time to better match your brand voice.',
  },
  {
    question: 'Which e-commerce platforms do you support?',
    answer: 'We currently integrate with Shopify and WooCommerce. Additional platforms are on the roadmap. The AI modules work with any store once connected.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Cancel anytime with no penalties or hidden fees. We also offer a 30-day money-back guarantee on your first month.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level encryption, multi-tenant data isolation, and never share your data with third parties. Your business data stays yours.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-gray-900 group-hover:text-cyan-700 transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-40 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Common questions
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y-0 px-6">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
