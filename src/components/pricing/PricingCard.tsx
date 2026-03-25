'use client'

import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Check, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  name: string
  description: string
  price: number
  originalPrice?: number
  period: string
  features: PricingFeature[]
  isPopular?: boolean
  isSpecialOffer?: boolean
  savingsBadge?: string
  ctaText?: string
  ctaVariant?: 'default' | 'outline' | 'secondary'
  index?: number
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function PricingCard({
  name,
  description,
  price,
  originalPrice,
  period,
  features,
  isPopular = false,
  isSpecialOffer = false,
  savingsBadge,
  ctaText = 'Get Started',
  ctaVariant = 'default',
  index = 0,
}: PricingCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={cn(
        'relative h-full',
        isPopular && 'z-10'
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-lg shadow-blue-500/30 border-0">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Special Offer Badge */}
      {isSpecialOffer && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 text-sm font-semibold shadow-lg shadow-green-500/30 border-0 animate-pulse">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Limited Time Offer
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          'h-full flex flex-col transition-all duration-300',
          isPopular
            ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/10 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20 dark:to-background'
            : 'border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg',
          isSpecialOffer && 'border-2 border-green-400 dark:border-green-600 shadow-lg shadow-green-500/10'
        )}
      >
        <CardHeader className="text-center pb-4">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          {/* Price Display */}
          <div className="mt-4">
            {originalPrice && (
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg text-muted-foreground line-through">
                  ${originalPrice}
                </span>
                {savingsBadge && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs font-semibold border-0">
                    {savingsBadge}
                  </Badge>
                )}
              </div>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">${price}</span>
              <span className="text-muted-foreground text-sm">/{period}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className={cn(
                  'flex items-start gap-3 text-sm',
                  feature.included ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                    feature.included
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Check className="w-3 h-3" />
                </div>
                <span className={feature.included ? '' : 'line-through opacity-60'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            variant={ctaVariant}
            className={cn(
              'w-full font-semibold',
              isPopular && 'bg-blue-600 hover:bg-blue-700',
              isSpecialOffer && 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
            )}
            size="lg"
          >
            {ctaText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
