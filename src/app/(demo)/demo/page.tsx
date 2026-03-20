"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  BookOpen,
  Package,
  Mail,
  Users,
  Video,
  Star,
  Verified,
  Sparkles,
  ShoppingBag,
  Play
} from "lucide-react"

// Demo store data
const demoStore = {
  name: "Sarah Chen",
  username: "sarahchen",
  bio: "Digital Creator & Online Business Coach | Helping you build your dream online business",
  location: "San Francisco, CA",
  avatar: null,
  verified: true,
  stats: {
    products: 12,
    students: 2500,
    rating: 4.9
  },
  socialLinks: [
    { icon: "youtube", url: "#", label: "YouTube" },
    { icon: "instagram", url: "#", label: "Instagram" },
    { icon: "twitter", url: "#", label: "Twitter" },
    { icon: "tiktok", url: "#", label: "TikTok" },
  ],
  links: [
    { 
      title: "🚀 FREE: 7-Figure Creator Blueprint", 
      url: "#", 
      type: "free",
      description: "Download my free guide to building a 7-figure creator business",
      downloads: 15234
    },
    { 
      title: "📱 Social Media Mastery Course", 
      url: "#", 
      type: "course",
      price: "$97",
      originalPrice: "$297",
      students: 1847,
      rating: 4.9,
      lessons: 42
    },
    { 
      title: "💰 Digital Product Starter Kit", 
      url: "#", 
      type: "product",
      price: "$47",
      originalPrice: "$97",
      sales: 892,
      image: null
    },
    { 
      title: "📅 Book 1:1 Strategy Call", 
      url: "#", 
      type: "booking",
      price: "$150/hr",
      availability: "Next: Tomorrow 2pm"
    },
    { 
      title: "💌 Join My Newsletter", 
      url: "#", 
      type: "newsletter",
      subscribers: "15K+",
      frequency: "Weekly"
    },
    { 
      title: "👥 Creator Community", 
      url: "#", 
      type: "community",
      members: 2340,
      tier: "Premium"
    },
  ]
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Demo Store
            </Badge>
          </div>
        </div>
      </header>

      {/* Mobile-First Link-in-Bio Style Profile */}
      <main className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25">
                {demoStore.name.split(' ').map(n => n[0]).join('')}
              </div>
              {demoStore.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-4 border-background">
                  <Verified className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name & Bio */}
            <h1 className="text-2xl font-bold text-foreground mb-1">{demoStore.name}</h1>
            <p className="text-muted-foreground text-sm mb-2">@{demoStore.username}</p>
            <p className="text-foreground/80 text-sm mb-3 max-w-xs mx-auto">{demoStore.bio}</p>
            
            {/* Location */}
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>{demoStore.location}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{demoStore.stats.products}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{demoStore.stats.students.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-foreground">{demoStore.stats.rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {demoStore.socialLinks.map((social) => (
                <Button key={social.label} variant="outline" size="icon" className="w-10 h-10 rounded-full">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            {demoStore.links.map((link, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20">
                  <CardContent className="p-0">
                    {/* Free Resource */}
                    {link.type === "free" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{link.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                              FREE
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {link.downloads?.toLocaleString()} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Course */}
                    {link.type === "course" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                              {link.lessons} lessons
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {link.rating}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {link.students?.toLocaleString()} students
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-foreground">{link.price}</span>
                            <span className="text-sm text-muted-foreground line-through">{link.originalPrice}</span>
                            <Badge variant="destructive" className="text-xs">67% OFF</Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Product */}
                    {link.type === "product" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-muted-foreground">
                              {link.sales} sold
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-foreground">{link.price}</span>
                            <span className="text-sm text-muted-foreground line-through">{link.originalPrice}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking */}
                    {link.type === "booking" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-600 dark:text-green-400">{link.availability}</span>
                          </div>
                          <div className="mt-2">
                            <span className="font-bold text-foreground">{link.price}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Newsletter */}
                    {link.type === "newsletter" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className="bg-pink-500/10 text-pink-600">
                              {link.subscribers} subscribers
                            </Badge>
                            <span className="text-xs text-muted-foreground">{link.frequency}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Community */}
                    {link.type === "community" && (
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6 text-cyan-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-muted-foreground">
                              {link.members?.toLocaleString()} members
                            </span>
                            <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600">
                              {link.tier}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="pt-6 pb-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Create your own store like this in minutes
            </p>
            <Button size="lg" className="w-full sm:w-auto px-8" asChild>
              <Link href="/signup">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-md mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-semibold text-primary">CreatorHub</span>
            <span>•</span>
            <span>Create your own store</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
