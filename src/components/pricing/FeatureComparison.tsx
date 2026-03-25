'use client'

import { motion, type Variants } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const features = [
  { name: 'Link-in-Bio Store', creatorhub: true, stan: true, linktree: true, kajabi: true },
  { name: 'Unlimited Products', creatorhub: true, stan: true, linktree: false, kajabi: true },
  { name: 'Course Builder', creatorhub: true, stan: true, linktree: false, kajabi: true },
  { name: 'Email Marketing', creatorhub: '500+', stan: '5,000', linktree: false, kajabi: 'Unlimited' },
  { name: 'Calendar Bookings', creatorhub: true, stan: true, linktree: false, kajabi: true },
  { name: 'Video Hosting', creatorhub: true, stan: true, linktree: false, kajabi: true },
  { name: '1:1 Coaching Tools', creatorhub: true, stan: false, linktree: false, kajabi: true },
  { name: 'White-label Option', creatorhub: true, stan: false, linktree: false, kajabi: true },
  { name: 'Advanced Analytics', creatorhub: true, stan: true, linktree: 'Basic', kajabi: true },
  { name: 'Priority Support', creatorhub: true, stan: true, linktree: false, kajabi: true },
]

const plans = [
  {
    name: 'CreatorHub',
    price: '$10',
    highlight: true,
    badge: 'Best Value',
  },
  {
    name: 'Stan Store',
    price: '$29',
    highlight: false,
  },
  {
    name: 'Linktree',
    price: '$5-24',
    highlight: false,
  },
  {
    name: 'Kajabi',
    price: '$149',
    highlight: false,
  },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
    )
  }
  return <span className="text-sm font-medium">{value}</span>
}

export default function FeatureComparison() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Compare with Alternatives
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how CreatorHub stacks up against other creator platforms. 
            More features, better price.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 p-0">
              <div className="grid grid-cols-5 gap-0">
                <div className="p-4 lg:p-6">
                  <CardTitle className="text-lg text-foreground">Features</CardTitle>
                </div>
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      'p-4 lg:p-6 text-center border-l',
                      plan.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-transparent'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {plan.badge && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          {plan.badge}
                        </span>
                      )}
                      <span className="font-bold">{plan.name}</span>
                      <span className={cn(
                        'text-sm',
                        plan.highlight ? 'text-blue-100' : 'text-muted-foreground'
                      )}>
                        {plan.price}/mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.name}
                  variants={rowVariants}
                  className={cn(
                    'grid grid-cols-5 gap-0 border-b last:border-b-0',
                    idx % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'
                  )}
                >
                  <div className="p-3 lg:p-4 text-sm font-medium text-foreground">
                    {feature.name}
                  </div>
                  <div className={cn(
                    'p-3 lg:p-4 flex items-center justify-center border-l',
                    'text-center'
                  )}>
                    <FeatureCell value={feature.creatorhub} />
                  </div>
                  <div className="p-3 lg:p-4 flex items-center justify-center border-l">
                    <FeatureCell value={feature.stan} />
                  </div>
                  <div className="p-3 lg:p-4 flex items-center justify-center border-l">
                    <FeatureCell value={feature.linktree} />
                  </div>
                  <div className="p-3 lg:p-4 flex items-center justify-center border-l">
                    <FeatureCell value={feature.kajabi} />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Value Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-lg font-medium text-foreground">
            CreatorHub gives you <span className="text-blue-600 dark:text-blue-400 font-bold">more features</span> at a{' '}
            <span className="text-green-600 dark:text-green-400 font-bold">fraction of the cost</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
