'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Star, 
  Shield, 
  Zap, 
  Clock,
  ArrowRight,
  Users,
  Globe,
  TrendingUp,
  Smartphone,
  Calendar,
  GraduationCap,
  BarChart2,
  Send,
  Mail,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { pricingPlans, competitorComparison, featureValueComparison, testimonials } from '@/lib/mock-data/features';

const featureIcons: Record<string, React.ElementType> = {
  'Link-in-Bio Store': Smartphone,
  'Calendar & Bookings': Calendar,
  'Course Builder': GraduationCap,
  'Analytics': BarChart2,
  'Instagram AutoDMs': Send,
  'Email Marketing': Mail,
  'Community Access': Users,
  '1:1 Coaching Tools': Headphones,
};

const faqs = [
  {
    question: "What's included in the Pro plan?",
    answer: "The Pro plan includes ALL features: unlimited products, course builder, calendar & bookings, email marketing (up to 5,000 subscribers), Instagram AutoDMs, advanced analytics, 1:1 coaching tools, priority support, and custom domain. It's our most popular plan because you get everything for just $29/month.",
  },
  {
    question: "How does CreatorHub compare to Stan Store?",
    answer: "Stan Store charges $29-99/month and offers fewer features. CreatorHub Pro at $29/month includes everything Stan Store offers PLUS email marketing, Instagram AutoDMs, coaching tools, and advanced analytics. You'd need to pay for separate tools with Stan Store, but with CreatorHub, it's all included.",
  },
  {
    question: "How does CreatorHub compare to Kajabi?",
    answer: "Kajabi starts at $149/month for basic features. CreatorHub Pro at $29/month includes everything Kajabi offers plus calendar bookings, Instagram AutoDMs, and coaching tools - saving you over $100/month. Our course builder is equally powerful but more intuitive.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! You can cancel your subscription at any time directly from your dashboard. No long-term contracts, no hidden fees. Your access continues until the end of your billing period. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "What are the feature limits on each plan?",
    answer: "Starter (Free): 3 products, 100 email subscribers, basic analytics. Pro ($29): Unlimited products, 5,000 email subscribers, all features unlocked. Business ($79): Everything in Pro plus team collaboration, unlimited emails, API access, and dedicated support.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! We offer a 14-day free trial on our Pro plan. No credit card required to start. You get full access to all features during the trial. You can downgrade to the free Starter plan anytime.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Absolutely! You can change your plan at any time from your account settings. Changes take effect immediately, and we'll prorate the difference. Upgrades are instant, and downgrades apply at the next billing cycle.",
  },
];

const trustedByStats = [
  { value: '50,000+', label: 'Active Creators' },
  { value: '$12M+', label: 'Creator Earnings' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Rating' },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly' && monthlyPrice > 0) {
      return Math.round(monthlyPrice * 10); // 2 months free
    }
    return monthlyPrice;
  };

  const totalTheirPrice = featureValueComparison.reduce((sum, f) => sum + f.theirPrice, 0);
  const ourPrice = 29;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-1.5">
            93% Savings Compared to Separate Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Stop Paying for{' '}
            <span className="gradient-text">Multiple Tools</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to monetize your creativity in one platform.
            One simple price. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn(
              'text-sm font-medium',
              billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            )}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
            <span className={cn(
              'text-sm font-medium',
              billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
            )}>
              Yearly <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Save 17%</Badge>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Feature Value Comparison Section - Stan Store Style */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Stop Paying for Multiple Tools</h2>
                <p className="text-blue-100">Everything you need in one platform</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Feature Table */}
              <div className="divide-y divide-blue-100 dark:divide-blue-900/50">
                {/* Header Row */}
                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-950/30 font-semibold text-sm">
                  <div className="flex-1">Feature</div>
                  <div className="w-24 text-center text-muted-foreground">Their Price</div>
                  <div className="w-24 text-center text-blue-600 dark:text-blue-400">Our Price</div>
                </div>
                
                {/* Feature Rows */}
                {featureValueComparison.map((item, index) => {
                  const Icon = featureIcons[item.feature] || Sparkles;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.feature}</div>
                          <div className="text-xs text-muted-foreground">Replaces: {item.replaces}</div>
                        </div>
                      </div>
                      <div className="w-24 text-center">
                        <span className="text-muted-foreground">${item.theirPrice}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      <div className="w-24 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Row */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-blue-100 text-sm">Total Value</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold line-through opacity-60">${totalTheirPrice}</span>
                        <Badge className="bg-white/20 text-white border-white/30">Save 93%</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Your Price</p>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-4xl font-extrabold">${billingCycle === 'yearly' ? Math.round(ourPrice * 10) : ourPrice}</span>
                      <span className="text-white/80">/mo</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8"
                    asChild
                  >
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500" />
            No setup fees
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500" />
            Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500" />
            All features included
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500" />
            24/7 support
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {pricingPlans.map((plan, planIndex) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: planIndex * 0.1 }}
            >
              <Card
                className={cn(
                  'relative overflow-hidden h-full',
                  plan.highlighted && 'border-blue-500 border-2 shadow-xl scale-105 z-10'
                )}
              >
                {plan.badge && (
                  <div className={cn(
                    'absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg',
                    plan.highlighted
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  )}>
                    {plan.badge}
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="mb-2">
                        <span className="text-muted-foreground line-through text-xl">
                          ${plan.originalPrice}/month
                        </span>
                        <Badge variant="destructive" className="ml-2">
                          93% OFF
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-primary">
                        {plan.price === 0 ? 'Free' : `$${getPrice(plan.price)}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground ml-1">/mo</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted By Stats */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Trusted by Creators Worldwide</h2>
          <p className="text-muted-foreground">Join thousands of successful creators</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {trustedByStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Loved by Creators</h2>
          <p className="text-muted-foreground">See what our community has to say</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          How We Compare
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          See how CreatorHub stacks up against other platforms
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-4 px-4 font-semibold">Platform</th>
                <th className="text-center py-4 px-4 font-semibold">Starter</th>
                <th className="text-center py-4 px-4 font-semibold">Pro</th>
                <th className="text-center py-4 px-4 font-semibold">Business</th>
              </tr>
            </thead>
            <tbody>
              {competitorComparison.map((row, index) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'border-b',
                    row.name === 'CreatorHub' && 'bg-blue-50 dark:bg-blue-950 font-medium'
                  )}
                >
                  <td className="py-4 px-4">
                    {row.name === 'CreatorHub' && (
                      <Sparkles className="inline w-4 h-4 mr-1 text-blue-600" />
                    )}
                    {row.name}
                  </td>
                  <td className={cn(
                    'text-center py-4 px-4',
                    row.name === 'CreatorHub' && 'text-blue-600 font-semibold'
                  )}>{row.starter}</td>
                  <td className={cn(
                    'text-center py-4 px-4',
                    row.name === 'CreatorHub' && 'text-blue-600 font-semibold'
                  )}>{row.pro}</td>
                  <td className={cn(
                    'text-center py-4 px-4',
                    row.name === 'CreatorHub' && 'text-blue-600 font-semibold'
                  )}>{row.business}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Everything you need to know about CreatorHub
        </p>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{faq.question}</CardTitle>
                    <span className="text-muted-foreground text-xl">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10 pointer-events-none" />
            <CardContent className="py-12 relative z-10">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                Join 50,000+ creators who turned their passion into profit.
                Start your free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="font-semibold" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  30-day guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Cancel anytime
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Bottom Trust Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="text-sm">Available worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">SSL encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">99.9% uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">24/7 support</span>
          </div>
        </div>
      </section>
    </div>
  );
}
