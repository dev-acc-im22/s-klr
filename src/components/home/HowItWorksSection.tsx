'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, Rocket } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Store,
    title: 'Create Your Store',
    description: 'Sign up and set up your personalized storefront in minutes. Choose your theme, add your branding, and connect your payment account.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    step: 2,
    icon: Package,
    title: 'Add Your Products',
    description: 'Upload your digital products, create courses, or set up booking services. Our intuitive editor makes it easy.',
    color: 'from-blue-600 to-blue-700',
  },
  {
    step: 3,
    icon: Rocket,
    title: 'Share & Earn',
    description: 'Share your store link on social media, email, or anywhere your audience is. Start earning from day one.',
    color: 'from-blue-500 to-blue-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Start Selling in{' '}
            <span className="gradient-text">3 Easy Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No technical skills required. Get your creator store up and running in under 10 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-700 dark:to-blue-900 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full card-hover border-0 shadow-lg bg-card relative overflow-hidden">
                  {/* Step Number Badge */}
                  <div className="absolute -top-px -right-px">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} flex items-center justify-center rounded-bl-xl`}>
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                  </div>

                  <CardContent className="p-6 lg:p-8 pt-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <step.icon className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Time Estimate */}
                    <div className="mt-6 pt-4 border-t">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {index === 0 ? '~5 minutes' : index === 1 ? '~10 minutes' : 'Instant'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-muted/50 rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Setup in minutes</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">No coding required</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">Free to start</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
