'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
      
      {/* Animated Elements - CSS animations instead of Framer Motion */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use initial={false} to prevent hidden state on first render */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              Free forever plan available
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
            Ready to Start Your{' '}
            <span className="text-blue-200">Creator Journey?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Join thousands of creators who are building sustainable businesses. 
            Set up your store in minutes and start earning today.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="btn-press px-8 py-6 text-lg font-semibold bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-blue-900/30 group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Schedule a Demo
            </Button>
          </motion.div>

          {/* Trust Text */}
          <motion.p
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 text-sm text-blue-200"
          >
            No credit card required • Free forever plan • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
