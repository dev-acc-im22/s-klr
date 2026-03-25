// Mock data for demo store

export interface MockSocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface MockProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  salesCount: number;
}

export interface MockLesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
}

export interface MockModule {
  id: string;
  title: string;
  lessons: MockLesson[];
}

export interface MockCourse {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  modules: MockModule[];
  enrollmentCount: number;
  rating: number;
}

export interface MockStoreProfile {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  socialLinks: MockSocialLink[];
}

// Demo store data
export const demoStore: MockStoreProfile = {
  username: "demo",
  name: "Demo Creator",
  bio: "Digital creator & educator helping you build your online presence. 🚀 Download my free resources and courses to level up your skills!",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
  socialLinks: [
    {
      id: "1",
      platform: "Instagram",
      url: "https://instagram.com/demo",
      icon: "instagram",
    },
    {
      id: "2",
      platform: "YouTube",
      url: "https://youtube.com/@demo",
      icon: "youtube",
    },
    {
      id: "3",
      platform: "Twitter",
      url: "https://twitter.com/demo",
      icon: "twitter",
    },
    {
      id: "4",
      platform: "TikTok",
      url: "https://tiktok.com/@demo",
      icon: "tiktok",
    },
  ],
};

export const demoProducts: MockProduct[] = [
  {
    id: "prod-1",
    title: "Content Creator Starter Kit",
    description: "Everything you need to start your content creation journey. Includes templates, checklists, and guides for creating engaging content that converts. Perfect for beginners who want to build their audience fast.",
    price: 29,
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    ],
    category: "Templates",
    featured: true,
    salesCount: 1250,
  },
  {
    id: "prod-2",
    title: "Social Media Strategy Guide",
    description: "A comprehensive guide to building your social media presence from scratch. Learn proven strategies for growing on Instagram, TikTok, and YouTube with actionable steps.",
    price: 49,
    images: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop",
    ],
    category: "E-book",
    featured: true,
    salesCount: 890,
  },
  {
    id: "prod-3",
    title: "Email Marketing Templates",
    description: "50+ proven email templates for creators. Welcome sequences, sales emails, newsletters, and more. Just copy, paste, and customize for your audience.",
    price: 19,
    images: [
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop",
    ],
    category: "Templates",
    featured: false,
    salesCount: 2340,
  },
  {
    id: "prod-4",
    title: "Thumbnail Design Pack",
    description: "100+ customizable thumbnail templates for YouTube and social media. Includes Canva templates and design tips to make your content pop.",
    price: 15,
    images: [
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&h=600&fit=crop",
    ],
    category: "Templates",
    featured: false,
    salesCount: 3456,
  },
];

export const demoCourses: MockCourse[] = [
  {
    id: "course-1",
    title: "Build Your Creator Business",
    description: "A complete course on building a sustainable creator business. Learn how to monetize your content, build products, and create multiple income streams. Includes workbooks and community access.",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    price: 199,
    modules: [
      {
        id: "mod-1",
        title: "Getting Started",
        lessons: [
          { id: "les-1", title: "Welcome & Overview", duration: "5:30", isPreview: true },
          { id: "les-2", title: "Setting Your Goals", duration: "12:00", isPreview: false },
          { id: "les-3", title: "Finding Your Niche", duration: "18:45", isPreview: false },
        ],
      },
      {
        id: "mod-2",
        title: "Content Strategy",
        lessons: [
          { id: "les-4", title: "Content Planning", duration: "15:00", isPreview: false },
          { id: "les-5", title: "Creating Consistently", duration: "20:30", isPreview: false },
          { id: "les-6", title: "Engaging Your Audience", duration: "14:15", isPreview: false },
        ],
      },
      {
        id: "mod-3",
        title: "Monetization",
        lessons: [
          { id: "les-7", title: "Product Creation", duration: "25:00", isPreview: false },
          { id: "les-8", title: "Pricing Strategies", duration: "18:30", isPreview: false },
          { id: "les-9", title: "Launch Blueprint", duration: "30:00", isPreview: false },
        ],
      },
    ],
    enrollmentCount: 456,
    rating: 4.8,
  },
  {
    id: "course-2",
    title: "Instagram Growth Masterclass",
    description: "Learn the exact strategies I used to grow to 100K followers. Covers content creation, hashtags, reels, stories, and engagement tactics that actually work in 2024.",
    coverImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop",
    price: 79,
    modules: [
      {
        id: "mod-4",
        title: "Foundation",
        lessons: [
          { id: "les-10", title: "Profile Optimization", duration: "10:00", isPreview: true },
          { id: "les-11", title: "Content Pillars", duration: "15:30", isPreview: false },
        ],
      },
      {
        id: "mod-5",
        title: "Content Creation",
        lessons: [
          { id: "les-12", title: "Reels Strategy", duration: "22:00", isPreview: false },
          { id: "les-13", title: "Carousel Posts", duration: "18:45", isPreview: false },
          { id: "les-14", title: "Stories That Convert", duration: "16:30", isPreview: false },
        ],
      },
    ],
    enrollmentCount: 892,
    rating: 4.9,
  },
];

// Helper to get store by username
export function getMockStore(username: string): MockStoreProfile | null {
  if (username === "demo") {
    return demoStore;
  }
  return null;
}

export function getMockProducts(username: string): MockProduct[] {
  if (username === "demo") {
    return demoProducts;
  }
  return [];
}

export function getMockCourses(username: string): MockCourse[] {
  if (username === "demo") {
    return demoCourses;
  }
  return [];
}

export function getMockProduct(username: string, productId: string): MockProduct | null {
  if (username === "demo") {
    return demoProducts.find((p) => p.id === productId) || null;
  }
  return null;
}

export function getMockCourse(username: string, courseId: string): MockCourse | null {
  if (username === "demo") {
    return demoCourses.find((c) => c.id === courseId) || null;
  }
  return null;
}
