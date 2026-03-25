'use client'

import { motion, type Variants } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Coach',
    avatar: '',
    initials: 'SJ',
    content: 'I was paying $29/month for Stan Store before. CreatorHub gives me all the same features plus more for just $10. The course builder alone is worth it!',
    rating: 5,
    earnings: '$12K/month',
  },
  {
    name: 'Mike Chen',
    role: 'Digital Artist',
    avatar: '',
    initials: 'MC',
    content: 'Finally, a platform that doesn\'t take a huge cut of my earnings. I\'ve saved over $200/month switching to CreatorHub. The email marketing is a game changer.',
    rating: 5,
    earnings: '$8K/month',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Wellness Coach',
    avatar: '',
    initials: 'ER',
    content: 'The $10 offer seemed too good to be true, but it\'s real. I have everything I need - products, courses, bookings. My revenue has doubled in 3 months.',
    rating: 5,
    earnings: '$15K/month',
  },
  {
    name: 'David Park',
    role: 'Business Consultant',
    avatar: '',
    initials: 'DP',
    content: 'I used to pay $149/month for Kajabi. CreatorHub does 90% of what I need at a fraction of the price. The white-label option is perfect for my brand.',
    rating: 5,
    earnings: '$25K/month',
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function TestimonialSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Creators Love CreatorHub
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who have already made the switch
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border hover:border-blue-200 dark:hover:border-blue-800">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
                          {testimonial.initials}
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
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Earning</div>
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {testimonial.earnings}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold">50,000+</div>
              <div className="text-blue-100 text-sm mt-1">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold">$10M+</div>
              <div className="text-blue-100 text-sm mt-1">Creator Earnings</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold">4.9/5</div>
              <div className="text-blue-100 text-sm mt-1">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold">98%</div>
              <div className="text-blue-100 text-sm mt-1">Save vs Others</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
