'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useHydrated } from '@/components/providers/HydrationProvider'
import { 
  ArrowRight, 
  Play, 
  Users, 
  DollarSign, 
  Star,
  ShoppingCart
} from 'lucide-react'

const stats = [
  { value: '50K+', label: 'Creators', icon: Users },
  { value: '$10M+', label: 'Earned', icon: DollarSign },
  { value: '4.9/5', label: 'Rating', icon: Star },
]

// Reduced variants for smoother initial load
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export default function HeroSection() {
  const isHydrated = useHydrated()

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-blue-100 dark:from-blue-950 dark:via-background dark:to-blue-900/30" />
      
      {/* Animated Background Elements - CSS animation instead of Framer Motion */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Use initial={false} to prevent hidden state on first render */}
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge 
              variant="secondary" 
              className="px-4 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0"
            >
              <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
              #1 Creator Platform for 2024
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block text-foreground">Turn Your Content</span>
            <span className="block gradient-text">Into Income</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            The all-in-one platform to sell digital products, courses, and services. 
            Build your creator business in minutes, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="btn-press px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 w-5 h-5" />
                View Demo
              </Link>
            </Button>
          </motion.div>

          {/* Visual Mockup - Abstract Store Illustration */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto max-w-3xl"
          >
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-1 shadow-2xl shadow-blue-500/20">
              <div className="bg-card rounded-xl p-6 sm:p-8">
                {/* Mock Store Preview */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
                    <div className="h-3 w-24 bg-muted rounded mt-2" />
                  </div>
                </div>
                
                {/* Mock Products Grid - Static, no animation */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg flex items-center justify-center"
                    >
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg" />
                    </div>
                  ))}
                </div>

                {/* Mock Stats Bar */}
                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Live Store</span>
                  </div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    +127% this month
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-2">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
