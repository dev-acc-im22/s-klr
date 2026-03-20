'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  Calendar, 
  GraduationCap, 
  BarChart2,
  Send,
  Mail,
  Users,
  Headphones,
  ArrowRight,
  Check
} from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Mobile Optimized "Link-in-Bio" Store',
    description: 'Beautiful, mobile-first store that replaces your link-in-bio',
    replaces: 'Squarespace, Linktree',
    price: 29,
  },
  {
    icon: Calendar,
    title: 'Calendar Invites & Bookings',
    description: 'Seamless scheduling and booking management',
    replaces: 'Calendly, Acuity',
    price: 15,
  },
  {
    icon: GraduationCap,
    title: 'Course Builder',
    description: 'Create and sell online courses with ease',
    replaces: 'Kajabi',
    price: 119,
  },
  {
    icon: BarChart2,
    title: 'Audience Analytics',
    description: 'Deep insights into your audience and performance',
    replaces: 'Google Analytics',
    price: 10,
  },
  {
    icon: Send,
    title: 'Instagram AutoDMs',
    description: 'Automate your Instagram direct messages',
    replaces: 'ManyChat',
    price: 15,
  },
  {
    icon: Mail,
    title: 'Email List / Newsletter Builder',
    description: 'Build and nurture your email audience',
    replaces: 'Mailchimp, ConvertKit',
    price: 29,
  },
  {
    icon: Users,
    title: 'Exclusive Creator Community Access',
    description: 'Connect with fellow creators in our private community',
    replaces: 'Private community',
    price: 97,
  },
  {
    icon: Headphones,
    title: '1:1 Creator Strategy Coaching',
    description: 'Personalized coaching to grow your business',
    replaces: 'Personalized coaching',
    price: 99,
  },
]

const totalValue = features.reduce((sum, f) => sum + f.price, 0)
const ourPrice = 29

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export default function FeatureComparison() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            All-In-One Platform
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need,{' '}
            <span className="gradient-text">One Price</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop paying for multiple tools. Get all these features and more for one simple monthly price.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <CardContent className="p-0">
              {/* Features List */}
              <div className="divide-y divide-blue-100 dark:divide-blue-900/50">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial={false}
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      
                      {/* Text */}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          Replaces: {feature.replaces}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex-shrink-0 text-right ml-4">
                      <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${feature.price}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">/mo</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Pricing Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Total Value */}
                  <div className="text-center sm:text-left">
                    <p className="text-blue-100 text-sm mb-1">Total Value</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-white/60 line-through decoration-white/40">
                        ${totalValue}/mo
                      </span>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm">
                        Save 93%
                      </Badge>
                    </div>
                  </div>

                  {/* Our Price */}
                  <div className="text-center sm:text-right">
                    <p className="text-blue-100 text-sm mb-1">Your Price</p>
                    <div className="flex items-baseline gap-1 justify-center sm:justify-end">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white">
                        ${ourPrice}
                      </span>
                      <span className="text-white/80 text-lg">/mo</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg shadow-xl shadow-black/20 w-full sm:w-auto"
                  >
                    Join Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Features included note */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      No setup fees
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Cancel anytime
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      All features included
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      24/7 support
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground text-sm">
            Join <span className="font-semibold text-foreground">10,000+ creators</span> who have already made the switch
          </p>
        </motion.div>
      </div>
    </section>
  )
}
