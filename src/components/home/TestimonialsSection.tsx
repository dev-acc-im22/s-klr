'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Fitness Coach',
    avatar: 'SC',
    image: '/avatars/sarah.svg',
    content: 'CreatorHub completely transformed my business. I went from struggling to sell a few PDFs to making $15K in my first month. The platform is so easy to use!',
    revenue: '$15K/month',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Digital Artist',
    avatar: 'MJ',
    image: '/avatars/marcus.svg',
    content: 'Finally, a platform that understands creators. The booking system alone has saved me hours every week. My students love the course experience too.',
    revenue: '$8K/month',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Consultant',
    avatar: 'ER',
    image: '/avatars/emily.svg',
    content: 'I\'ve tried them all - Gumroad, Teachable, you name it. CreatorHub beats them all. The analytics alone are worth it. I know exactly what\'s working.',
    revenue: '$25K/month',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Photography Educator',
    avatar: 'DP',
    image: '/avatars/david.svg',
    content: 'In just 6 months, I built a 6-figure business selling presets and courses. The support team is incredible and always there when I need help.',
    revenue: '$12K/month',
    rating: 5,
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

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background via-blue-50/30 to-background dark:from-background dark:via-blue-950/20 dark:to-background">
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
            Loved by{' '}
            <span className="gradient-text">50,000+ Creators</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of creators who have already built successful businesses on CreatorHub.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full card-hover border-0 shadow-md bg-card hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-blue-100 dark:text-blue-900/50">
                  <Quote className="w-12 h-12" />
                </div>

                <CardContent className="p-6 lg:p-8 relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-blue-100 dark:border-blue-900">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>

                    {/* Revenue Badge */}
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {testimonial.revenue}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm">50,000+ creators</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm ml-1">4.9/5 rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
