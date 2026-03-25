'use client'

import { motion, type Variants } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What\'s included in the $10/month plan?',
    answer: 'The $10/month Starter plan includes a mobile-optimized Link-in-Bio store, unlimited digital products, basic analytics, email list management for up to 500 subscribers, and access to our creator community. This is a special limited-time offer that gives you incredible value compared to other platforms.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! There are no long-term contracts or commitments. You can cancel your subscription at any time from your dashboard settings. Your store will remain active until the end of your billing period, and you\'ll keep access to all your content.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a 14-day free trial on all plans so you can explore all features before committing. No credit card required to start. Plus, all plans come with a 30-day money-back guarantee if you\'re not completely satisfied.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe. For annual plans, you can also pay via bank transfer.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can change your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at your next billing cycle. We\'ll prorate any differences accordingly.',
  },
  {
    question: 'Do you take a percentage of my sales?',
    answer: 'No! Unlike other platforms that charge 5-10% transaction fees, CreatorHub doesn\'t take any cut of your sales. You keep 100% of your revenue (minus standard payment processing fees from Stripe/PayPal).',
  },
  {
    question: 'Can I migrate from another platform?',
    answer: 'Yes! We offer free migration assistance for creators coming from Stan Store, Linktree, Gumroad, Teachable, and other platforms. Our team will help transfer your products, courses, and customer data seamlessly.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include access to our help center and community forum. Pro plans get priority email support with 24-hour response time. Business plans include dedicated support with live chat and phone options.',
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export default function FAQSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20 dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you don't see what you're looking for, contact our support team.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <AccordionItem value={`item-${index}`} className="px-6">
                      <AccordionTrigger className="text-left font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
