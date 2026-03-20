'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Download, 
  GraduationCap, 
  Calendar, 
  Mail, 
  BarChart3,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Download,
    title: 'Digital Products',
    description: 'Sell ebooks, templates, presets, and any digital file. Automatic delivery and secure downloads.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: GraduationCap,
    title: 'Online Courses',
    description: 'Create and sell courses with video lessons, modules, and progress tracking for your students.',
    color: 'from-blue-600 to-blue-700',
  },
  {
    icon: Calendar,
    title: 'Bookings & Calendar',
    description: 'Accept bookings for coaching calls, consultations, and services with integrated scheduling.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Build your email list and send newsletters. Connect with your audience directly.',
    color: 'from-blue-600 to-blue-700',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track sales, visitors, and revenue with beautiful insights. Know what\'s working.',
    color: 'from-blue-500 to-blue-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Monetize</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One platform with all the tools creators need to build a thriving online business.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full card-hover border-0 shadow-sm bg-card hover:shadow-xl hover:shadow-blue-500/5">
                <CardContent className="p-6 lg:p-8">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Learn more</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground">
            And many more features to help you succeed.{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              See all features →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
