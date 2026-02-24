import Navbar from '@/components/landing/navbar'
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import HowItWorks from '@/components/landing/how-it-works'
import SocialProof from '@/components/landing/social-proof'
import Pricing from '@/components/landing/pricing'
import Faq from '@/components/landing/faq'
import CtaSection from '@/components/landing/cta-section'
import Footer from '@/components/landing/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
