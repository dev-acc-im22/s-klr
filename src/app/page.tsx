'use client'

import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import FeatureComparison from '@/components/home/FeatureComparison'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section - Above the fold */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Feature Comparison - Stan Store Style */}
        <FeatureComparison />
        
        {/* How It Works Section */}
        <HowItWorksSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer - Sticky to bottom when content is short */}
      <Footer />
    </div>
  )
}
