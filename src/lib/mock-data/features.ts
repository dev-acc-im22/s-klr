// Mock data for all features when in ghost mode

// ============================================
// BOOKINGS DATA
// ============================================

export const mockBookings = [
  {
    id: 'booking-1',
    title: 'Strategy Call with Sarah',
    description: '1:1 business strategy consultation',
    status: 'CONFIRMED',
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    endTime: new Date(Date.now() + 86400000 + 3600000),
    timezone: 'America/New_York',
    meetingUrl: 'https://zoom.us/j/123456789',
    notes: 'Discuss Q2 marketing strategy',
    price: 150,
  },
  {
    id: 'booking-2',
    title: 'Content Review Session',
    description: 'Review content strategy and optimize',
    status: 'PENDING',
    startTime: new Date(Date.now() + 172800000), // Day after tomorrow
    endTime: new Date(Date.now() + 172800000 + 1800000),
    timezone: 'America/New_York',
    meetingUrl: null,
    notes: '',
    price: 99,
  },
  {
    id: 'booking-3',
    title: 'Course Planning Session',
    description: 'Plan online course structure',
    status: 'COMPLETED',
    startTime: new Date(Date.now() - 86400000), // Yesterday
    endTime: new Date(Date.now() - 86400000 + 3600000),
    timezone: 'America/Los_Angeles',
    meetingUrl: 'https://zoom.us/j/987654321',
    notes: 'Great session! Client wants to launch in 3 weeks.',
    price: 199,
  },
];

export const mockAvailability = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '14:00', isActive: true }, // Friday
];

// ============================================
// EMAIL MARKETING DATA
// ============================================

export const mockSubscribers = [
  { id: 'sub-1', email: 'john@example.com', name: 'John Smith', isActive: true, subscribedAt: new Date('2024-01-15') },
  { id: 'sub-2', email: 'sarah@example.com', name: 'Sarah Johnson', isActive: true, subscribedAt: new Date('2024-01-18') },
  { id: 'sub-3', email: 'mike@example.com', name: 'Mike Chen', isActive: true, subscribedAt: new Date('2024-01-20') },
  { id: 'sub-4', email: 'emily@example.com', name: 'Emily Davis', isActive: true, subscribedAt: new Date('2024-01-22') },
  { id: 'sub-5', email: 'alex@example.com', name: 'Alex Wilson', isActive: true, subscribedAt: new Date('2024-01-25') },
  { id: 'sub-6', email: 'lisa@example.com', name: 'Lisa Brown', isActive: true, subscribedAt: new Date('2024-02-01') },
  { id: 'sub-7', email: 'tom@example.com', name: 'Tom Anderson', isActive: true, subscribedAt: new Date('2024-02-03') },
  { id: 'sub-8', email: 'kate@example.com', name: 'Kate Miller', isActive: true, subscribedAt: new Date('2024-02-05') },
];

export const mockCampaigns = [
  {
    id: 'camp-1',
    subject: 'Welcome to the Community! 🎉',
    content: '<h1>Welcome!</h1><p>Thanks for joining our community...</p>',
    status: 'SENT',
    scheduledAt: null,
    sentAt: new Date('2024-02-01'),
    recipientCount: 156,
    openCount: 89,
    clickCount: 34,
  },
  {
    id: 'camp-2',
    subject: 'New Course Launch - Limited Time Offer!',
    content: '<h1>Exciting News!</h1><p>Our new course is live...</p>',
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 259200000),
    sentAt: null,
    recipientCount: 0,
    openCount: 0,
    clickCount: 0,
  },
  {
    id: 'camp-3',
    subject: 'Weekly Tips for Creators',
    content: '<h1>Weekly Tips</h1><p>This weeks top tips...</p>',
    status: 'DRAFT',
    scheduledAt: null,
    sentAt: null,
    recipientCount: 0,
    openCount: 0,
    clickCount: 0,
  },
];

// ============================================
// COMMUNITY DATA
// ============================================

export const mockCommunityPosts = [
  {
    id: 'post-1',
    title: 'Welcome to the Community!',
    content: 'Hey everyone! I\'m so excited to have you all here. This community is a space for us to connect, share ideas, and grow together. Feel free to introduce yourself below!',
    isPinned: true,
    isLocked: false,
    viewCount: 234,
    createdAt: new Date('2024-01-15'),
    author: { name: 'Ghost Admin', username: 'ghostadmin' },
    likeCount: 45,
    commentCount: 12,
  },
  {
    id: 'post-2',
    title: 'My Top 5 Tools for Content Creation',
    content: 'After years of creating content, I\'ve narrowed down my essential tools. Here are my top 5:\n\n1. Notion - for planning\n2. Canva - for graphics\n3. Loom - for tutorials\n4. Descript - for editing\n5. Buffer - for scheduling',
    isPinned: false,
    isLocked: false,
    viewCount: 189,
    createdAt: new Date('2024-01-20'),
    author: { name: 'Ghost Admin', username: 'ghostadmin' },
    likeCount: 67,
    commentCount: 23,
  },
  {
    id: 'post-3',
    title: 'Weekly Challenge: Share Your Best Tip',
    content: 'This week\'s challenge: Share your single best tip for growing an audience. Let\'s learn from each other!',
    isPinned: true,
    isLocked: false,
    viewCount: 156,
    createdAt: new Date('2024-01-25'),
    author: { name: 'Ghost Admin', username: 'ghostadmin' },
    likeCount: 34,
    commentCount: 45,
  },
];

export const mockComments = [
  // Post 1 comments
  { id: 'c-1', postId: 'post-1', content: 'So happy to be here! Looking forward to connecting with everyone.', author: { name: 'Sarah J.' }, createdAt: new Date('2024-01-16'), likes: 5, isLiked: false },
  { id: 'c-2', postId: 'post-1', content: 'This is exactly what I needed. Thank you for creating this space!', author: { name: 'Mike C.' }, createdAt: new Date('2024-01-17'), likes: 8, isLiked: true },
  { id: 'c-4', postId: 'post-1', content: 'Excited to learn from everyone here! 🎉', author: { name: 'Alex W.' }, createdAt: new Date('2024-01-18'), likes: 3, isLiked: false },
  { id: 'c-5', postId: 'post-1', content: 'Great community! Already found some valuable connections.', author: { name: 'Lisa B.' }, createdAt: new Date('2024-01-19'), likes: 6, isLiked: false },
  // Post 2 comments
  { id: 'c-3', postId: 'post-2', content: 'Notion is a game-changer! I use it for everything now.', author: { name: 'Emily D.' }, createdAt: new Date('2024-01-21'), likes: 12, isLiked: false },
  { id: 'c-6', postId: 'post-2', content: 'Descript has completely changed my editing workflow. Highly recommend!', author: { name: 'Tom A.' }, createdAt: new Date('2024-01-22'), likes: 7, isLiked: false },
  { id: 'c-7', postId: 'post-2', content: 'Buffer for scheduling is essential. Saves me so much time!', author: { name: 'Kate M.' }, createdAt: new Date('2024-01-23'), likes: 9, isLiked: true },
  { id: 'c-8', postId: 'post-2', content: 'Would add CapCut to this list for quick video edits!', author: { name: 'John S.' }, createdAt: new Date('2024-01-24'), likes: 4, isLiked: false },
  // Post 3 comments
  { id: 'c-9', postId: 'post-3', content: 'My best tip: Consistency beats perfection every time!', author: { name: 'Maria G.' }, createdAt: new Date('2024-01-26'), likes: 15, isLiked: false },
  { id: 'c-10', postId: 'post-3', content: 'Engage with your audience authentically. People can tell when you\'re being genuine.', author: { name: 'David L.' }, createdAt: new Date('2024-01-27'), likes: 11, isLiked: false },
  { id: 'c-11', postId: 'post-3', content: 'Focus on solving problems, not just creating content.', author: { name: 'Rachel K.' }, createdAt: new Date('2024-01-28'), likes: 18, isLiked: true },
  { id: 'c-12', postId: 'post-3', content: 'Collaborate with others in your niche - it\'s a win-win!', author: { name: 'Chris P.' }, createdAt: new Date('2024-01-29'), likes: 8, isLiked: false },
];

// ============================================
// COACHING DATA
// ============================================

export const mockCoachingPackages = [
  {
    id: 'pkg-1',
    title: 'Discovery Call',
    description: 'A 30-minute introductory call to discuss your goals and see if we\'re a good fit.',
    duration: 30,
    price: 0,
    isActive: true,
  },
  {
    id: 'pkg-2',
    title: 'Strategy Session',
    description: 'A focused 60-minute session to dive deep into your business strategy and create an action plan.',
    duration: 60,
    price: 199,
    isActive: true,
  },
  {
    id: 'pkg-3',
    title: 'Deep Dive Intensive',
    description: 'A comprehensive 90-minute session for complete strategy overhaul with follow-up support.',
    duration: 90,
    price: 349,
    isActive: true,
  },
];

export const mockCoachingSessions = [
  {
    id: 'coach-1',
    title: 'Strategy Session with Alex',
    status: 'CONFIRMED',
    scheduledAt: new Date(Date.now() + 86400000),
    duration: 60,
    price: 199,
    meetingUrl: 'https://zoom.us/j/coach1',
    notes: 'Prepare competitor analysis',
  },
  {
    id: 'coach-2',
    title: 'Deep Dive with Maria',
    status: 'PENDING',
    scheduledAt: new Date(Date.now() + 432000000),
    duration: 90,
    price: 349,
    meetingUrl: null,
    notes: '',
  },
  {
    id: 'coach-3',
    title: 'Discovery Call with James',
    status: 'COMPLETED',
    scheduledAt: new Date(Date.now() - 172800000),
    duration: 30,
    price: 0,
    meetingUrl: 'https://zoom.us/j/coach3',
    notes: 'Great potential client. Interested in monthly coaching.',
    recordingUrl: 'https://drive.google.com/recording1',
  },
];

// ============================================
// PRICING DATA
// ============================================

export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    originalPrice: null,
    description: 'Perfect for creators just getting started',
    features: [
      'Mobile-optimized Link-in-Bio',
      '3 digital products',
      'Basic analytics',
      'Email list (up to 100)',
      'Community access',
      'Standard support',
    ],
    highlighted: false,
    cta: 'Get Started Free',
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    originalPrice: 443,
    description: 'ALL features unlocked - Best value!',
    features: [
      'Everything in Starter',
      'Unlimited products',
      'Course builder',
      'Calendar & bookings',
      'Email marketing (up to 5,000)',
      'Instagram AutoDMs',
      'Advanced analytics',
      '1:1 Coaching tools',
      'Priority support',
      'Custom domain',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    badge: 'Best Value',
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    originalPrice: null,
    description: 'For established creators and teams',
    features: [
      'Everything in Pro',
      'Team collaboration (3 seats)',
      'Unlimited email marketing',
      'White-label option',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Advanced security',
    ],
    highlighted: false,
    cta: 'Contact Sales',
    badge: null,
  },
];

// Feature value comparison for Stan Store-style comparison
export const featureValueComparison = [
  { feature: 'Link-in-Bio Store', theirPrice: 29, replaces: 'Squarespace, Linktree' },
  { feature: 'Calendar & Bookings', theirPrice: 15, replaces: 'Calendly, Acuity' },
  { feature: 'Course Builder', theirPrice: 119, replaces: 'Kajabi, Teachable' },
  { feature: 'Analytics', theirPrice: 10, replaces: 'Google Analytics' },
  { feature: 'Instagram AutoDMs', theirPrice: 15, replaces: 'ManyChat' },
  { feature: 'Email Marketing', theirPrice: 29, replaces: 'Mailchimp, ConvertKit' },
  { feature: 'Community Access', theirPrice: 97, replaces: 'Circle, Mighty Networks' },
  { feature: '1:1 Coaching Tools', theirPrice: 99, replaces: 'Coaching platforms' },
];

export const competitorComparison = [
  { name: 'CreatorHub', starter: 'Free', pro: '$29', business: '$79' },
  { name: 'Stan Store', starter: '$29', pro: '$99', business: 'N/A' },
  { name: 'Linktree', starter: '$5', pro: '$24', business: 'Custom' },
  { name: 'Kajabi', starter: '$149', pro: '$199', business: '$399' },
  { name: 'Teachable', starter: '$0', pro: '$59', business: '$249' },
  { name: 'ConvertKit', starter: 'Free', pro: '$29', business: '$99' },
];

// Testimonials for social proof
export const testimonials = [
  {
    id: 't1',
    name: 'Sarah Mitchell',
    role: 'Fitness Coach',
    avatar: null,
    content: 'I was paying over $400/month for all these tools separately. CreatorHub literally saved me thousands. The course builder alone is worth the subscription!',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Alex Chen',
    role: 'Digital Marketer',
    avatar: null,
    content: 'The Instagram AutoDMs feature is a game-changer. I used to pay ManyChat $50/month for way less functionality. This is incredible value.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Maria Rodriguez',
    role: 'Course Creator',
    avatar: null,
    content: 'I switched from Kajabi and saved over $100/month. The migration was seamless and my students love the new interface. Best decision ever!',
    rating: 5,
  },
  {
    id: 't4',
    name: 'James Wilson',
    role: 'Content Creator',
    avatar: null,
    content: "As someone who was spending $443/month on various tools, finding CreatorHub felt like winning the lottery. Everything works together perfectly.",
    rating: 5,
  },
];

// ============================================
// INSTAGRAM AUTODMS DATA
// ============================================

export const mockInstagramAutomations = [
  {
    id: 'ig-auto-1',
    name: 'Welcome New Followers',
    triggerType: 'NEW_FOLLOWER',
    keywords: null,
    message: 'Hey {username}! 👋 Thanks for following! I\'m so excited to connect with you. Check out my latest content and let me know if you have any questions!',
    delay: 5,
    isActive: true,
    sentCount: 1234,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'ig-auto-2',
    name: 'Discount Code Auto-Reply',
    triggerType: 'KEYWORD_MENTION',
    keywords: JSON.stringify(['discount', 'code', 'promo', 'sale']),
    message: 'Hi {username}! 🎉 You asked about a discount code? Use code CREATOR20 for 20% off any of my products! Link in bio 🛍️',
    delay: 2,
    isActive: true,
    sentCount: 456,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ig-auto-3',
    name: 'Story Reply Thank You',
    triggerType: 'STORY_REPLY',
    keywords: null,
    message: 'Thanks for the reply {username}! 💖 I love hearing from my followers. Feel free to DM me anytime!',
    delay: 0,
    isActive: true,
    sentCount: 789,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'ig-auto-4',
    name: 'Course Interest Response',
    triggerType: 'KEYWORD_MENTION',
    keywords: JSON.stringify(['course', 'class', 'learn', 'tutorial']),
    message: 'Hey {username}! 📚 Interested in learning? Check out my courses at the link in my bio! I have options for all skill levels.',
    delay: 3,
    isActive: false,
    sentCount: 234,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'ig-auto-5',
    name: 'Comment Engagement',
    triggerType: 'COMMENT',
    keywords: null,
    message: 'Thanks for the comment {username}! 🙌 I appreciate you engaging with my content. Feel free to DM me if you want to chat more!',
    delay: 10,
    isActive: true,
    sentCount: 567,
    createdAt: new Date('2024-02-01'),
  },
];

export const mockInstagramActivity = [
  {
    id: 'activity-1',
    automationName: 'Welcome New Followers',
    recipient: '@sarah_fitness',
    sentAt: new Date(Date.now() - 300000), // 5 mins ago
    status: 'sent',
  },
  {
    id: 'activity-2',
    automationName: 'Discount Code Auto-Reply',
    recipient: '@mike_travels',
    sentAt: new Date(Date.now() - 900000), // 15 mins ago
    status: 'sent',
  },
  {
    id: 'activity-3',
    automationName: 'Story Reply Thank You',
    recipient: '@emma_creates',
    sentAt: new Date(Date.now() - 1800000), // 30 mins ago
    status: 'sent',
  },
  {
    id: 'activity-4',
    automationName: 'Welcome New Followers',
    recipient: '@alex_designs',
    sentAt: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'sent',
  },
  {
    id: 'activity-5',
    automationName: 'Course Interest Response',
    recipient: '@jamie_fitness',
    sentAt: new Date(Date.now() - 7200000), // 2 hours ago
    status: 'sent',
  },
  {
    id: 'activity-6',
    automationName: 'Comment Engagement',
    recipient: '@taylor_music',
    sentAt: new Date(Date.now() - 14400000), // 4 hours ago
    status: 'sent',
  },
  {
    id: 'activity-7',
    automationName: 'Welcome New Followers',
    recipient: '@chris_photo',
    sentAt: new Date(Date.now() - 28800000), // 8 hours ago
    status: 'sent',
  },
  {
    id: 'activity-8',
    automationName: 'Discount Code Auto-Reply',
    recipient: '@jordan_art',
    sentAt: new Date(Date.now() - 43200000), // 12 hours ago
    status: 'sent',
  },
];

export const mockInstagramStats = {
  activeAutomations: 4,
  dmsSentThisMonth: 892,
  responseRate: 34.5,
  newFollowersReached: 567,
};

// ============================================
// AFFILIATE PROGRAM DATA
// ============================================

export const mockAffiliateProgram = {
  id: 'affiliate-program-1',
  creatorId: 'user-1',
  commissionRate: 15, // 15%
  cookieDuration: 30, // 30 days
  isActive: true,
  createdAt: new Date('2024-01-01'),
  totalAffiliates: 12,
  totalClicks: 2456,
  totalConversions: 189,
  totalEarnings: 4567.89,
  pendingPayouts: 234.56,
};

export const mockAffiliates = [
  {
    id: 'affiliate-1',
    programId: 'affiliate-program-1',
    userId: 'user-2',
    code: 'SARAH15',
    clicks: 456,
    conversions: 34,
    earnings: 890.50,
    createdAt: new Date('2024-01-15'),
    user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
  },
  {
    id: 'affiliate-2',
    programId: 'affiliate-program-1',
    userId: 'user-3',
    code: 'MIKE2024',
    clicks: 389,
    conversions: 28,
    earnings: 723.45,
    createdAt: new Date('2024-01-20'),
    user: { name: 'Mike Chen', email: 'mike@example.com' },
  },
  {
    id: 'affiliate-3',
    programId: 'affiliate-program-1',
    userId: 'user-4',
    code: 'EMILYSAVE',
    clicks: 312,
    conversions: 22,
    earnings: 567.80,
    createdAt: new Date('2024-01-25'),
    user: { name: 'Emily Davis', email: 'emily@example.com' },
  },
  {
    id: 'affiliate-4',
    programId: 'affiliate-program-1',
    userId: 'user-5',
    code: 'ALEXDEALS',
    clicks: 245,
    conversions: 18,
    earnings: 445.60,
    createdAt: new Date('2024-02-01'),
    user: { name: 'Alex Wilson', email: 'alex@example.com' },
  },
  {
    id: 'affiliate-5',
    programId: 'affiliate-program-1',
    userId: 'user-6',
    code: 'LISA15',
    clicks: 198,
    conversions: 15,
    earnings: 367.25,
    createdAt: new Date('2024-02-05'),
    user: { name: 'Lisa Brown', email: 'lisa@example.com' },
  },
];

export const mockAffiliateClicks = [
  {
    id: 'click-1',
    affiliateId: 'affiliate-1',
    productId: 'product-1',
    visitorIp: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date(Date.now() - 300000), // 5 mins ago
  },
  {
    id: 'click-2',
    affiliateId: 'affiliate-2',
    productId: 'product-2',
    visitorIp: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
    createdAt: new Date(Date.now() - 600000), // 10 mins ago
  },
  {
    id: 'click-3',
    affiliateId: 'affiliate-1',
    productId: 'product-3',
    visitorIp: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: new Date(Date.now() - 900000), // 15 mins ago
  },
  {
    id: 'click-4',
    affiliateId: 'affiliate-3',
    productId: null,
    visitorIp: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (Linux; Android 10)',
    createdAt: new Date(Date.now() - 1200000), // 20 mins ago
  },
  {
    id: 'click-5',
    affiliateId: 'affiliate-2',
    productId: 'product-1',
    visitorIp: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0)',
    createdAt: new Date(Date.now() - 1800000), // 30 mins ago
  },
];

export const mockAffiliateSales = [
  {
    id: 'sale-1',
    affiliateId: 'affiliate-1',
    orderId: 'order-1',
    commission: 45.50,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 'sale-2',
    affiliateId: 'affiliate-2',
    orderId: 'order-2',
    commission: 32.75,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: 'sale-3',
    affiliateId: 'affiliate-1',
    orderId: 'order-3',
    commission: 67.25,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
  },
  {
    id: 'sale-4',
    affiliateId: 'affiliate-3',
    orderId: 'order-4',
    commission: 28.90,
    status: 'PAID',
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
  },
  {
    id: 'sale-5',
    affiliateId: 'affiliate-4',
    orderId: 'order-5',
    commission: 54.30,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
  },
];

export const mockAffiliateStats = {
  totalAffiliates: 12,
  activeAffiliates: 8,
  totalClicks: 2456,
  totalConversions: 189,
  conversionRate: 7.7, // percentage
  totalEarnings: 4567.89,
  pendingPayouts: 234.56,
  paidOut: 4333.33,
  avgEarningsPerAffiliate: 380.66,
  clicksThisMonth: 892,
  conversionsThisMonth: 67,
  earningsThisMonth: 1234.56,
};

// Current user's affiliate data (when they are an affiliate for someone else)
export const mockMyAffiliateData = {
  code: 'MYCODE20',
  programId: 'affiliate-program-1',
  program: {
    creatorName: 'Ghost Admin',
    commissionRate: 15,
    cookieDuration: 30,
  },
  clicks: 234,
  conversions: 18,
  earnings: 456.78,
  pendingEarnings: 89.50,
  paidEarnings: 367.28,
  createdAt: new Date('2024-02-01'),
};

export const mockAffiliateLinkHistory = [
  {
    id: 'link-1',
    productTitle: 'Digital Marketing Masterclass',
    clicks: 45,
    conversions: 4,
    earnings: 89.60,
  },
  {
    id: 'link-2',
    productTitle: 'Social Media Templates Bundle',
    clicks: 38,
    conversions: 3,
    earnings: 44.85,
  },
  {
    id: 'link-3',
    productTitle: 'Content Creation Course',
    clicks: 32,
    conversions: 2,
    earnings: 59.90,
  },
  {
    id: 'link-4',
    productTitle: 'Email Marketing Guide',
    clicks: 28,
    conversions: 2,
    earnings: 39.90,
  },
  {
    id: 'link-5',
    productTitle: 'Productivity Planner',
    clicks: 21,
    conversions: 1,
    earnings: 14.97,
  },
];

// ============================================
// QUIZ/ASSESSMENT DATA
// ============================================

export const mockQuizzes = [
  {
    id: 'quiz-1',
    title: 'Welcome Quiz',
    lessonId: 'l1',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'What is the main focus of this course?',
        options: ['Learning to code', 'Building a creator business', 'Mastering social media', 'Creating viral content'],
        correctAnswer: 1,
        order: 0,
      },
      {
        id: 'q2',
        question: 'Who is this course designed for?',
        options: ['Only experienced entrepreneurs', 'Anyone wanting to monetize their passion', 'People with large followings only', 'Tech-savvy individuals'],
        correctAnswer: 1,
        order: 1,
      },
      {
        id: 'q3',
        question: 'What will you be able to do after completing this course?',
        options: ['Code a website from scratch', 'Build a sustainable online business', 'Guarantee viral content', 'Automate all social media'],
        correctAnswer: 1,
        order: 2,
      },
    ],
    attempts: 45,
    passRate: 78,
  },
  {
    id: 'quiz-2',
    title: 'Niche Selection Quiz',
    lessonId: 'l3',
    passingScore: 80,
    maxAttempts: 2,
    questions: [
      {
        id: 'q4',
        question: 'What is the most important factor when choosing a niche?',
        options: ['Market demand', 'Your passion and expertise', 'Competition level', 'Potential income'],
        correctAnswer: 1,
        order: 0,
      },
      {
        id: 'q5',
        question: 'Why is it important to narrow down your niche?',
        options: ['To have less competition', 'To better serve a specific audience', 'To charge higher prices', 'All of the above'],
        correctAnswer: 3,
        order: 1,
      },
    ],
    attempts: 32,
    passRate: 65,
  },
];

export const mockQuizAttempts = [
  {
    id: 'attempt-1',
    quizId: 'quiz-1',
    userId: 'user-2',
    score: 80,
    passed: true,
    answers: [
      { selected: 1, correct: 1, isCorrect: true },
      { selected: 1, correct: 1, isCorrect: true },
      { selected: 1, correct: 1, isCorrect: true },
    ],
    completedAt: new Date(Date.now() - 86400000),
    user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
  },
  {
    id: 'attempt-2',
    quizId: 'quiz-1',
    userId: 'user-3',
    score: 60,
    passed: false,
    answers: [
      { selected: 0, correct: 1, isCorrect: false },
      { selected: 1, correct: 1, isCorrect: true },
      { selected: 3, correct: 1, isCorrect: false },
    ],
    completedAt: new Date(Date.now() - 172800000),
    user: { name: 'Mike Chen', email: 'mike@example.com' },
  },
  {
    id: 'attempt-3',
    quizId: 'quiz-2',
    userId: 'user-4',
    score: 100,
    passed: true,
    answers: [
      { selected: 1, correct: 1, isCorrect: true },
      { selected: 3, correct: 3, isCorrect: true },
    ],
    completedAt: new Date(Date.now() - 259200000),
    user: { name: 'Emily Davis', email: 'emily@example.com' },
  },
];

export const mockQuizStats = {
  totalQuizzes: 2,
  totalQuestions: 5,
  totalAttempts: 77,
  averageScore: 72,
  passRate: 71,
};

// ============================================
// DISCOUNT CODE DATA
// ============================================

export const mockDiscountCodes = [
  {
    id: 'discount-1',
    code: 'WELCOME20',
    name: 'Welcome Discount',
    type: 'PERCENTAGE',
    value: 20,
    minPurchase: 0,
    maxUses: 100,
    usedCount: 45,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: '', // Empty = all products
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'discount-2',
    code: 'FLASH50',
    name: 'Flash Sale - 50% Off',
    type: 'PERCENTAGE',
    value: 50,
    minPurchase: 25,
    maxUses: 50,
    usedCount: 38,
    startDate: new Date(Date.now() - 86400000), // Yesterday
    endDate: new Date(Date.now() + 86400000), // Tomorrow
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: '',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'discount-3',
    code: 'SAVE10',
    name: '$10 Off Orders $50+',
    type: 'FIXED',
    value: 10,
    minPurchase: 50,
    maxUses: 0, // Unlimited
    usedCount: 123,
    startDate: null,
    endDate: null,
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: '',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'discount-4',
    code: 'COURSE15',
    name: 'Course Launch Special',
    type: 'PERCENTAGE',
    value: 15,
    minPurchase: 0,
    maxUses: 200,
    usedCount: 89,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-03-15'),
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: JSON.stringify(['course-1', 'course-2']), // Specific courses only
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'discount-5',
    code: 'VIPACCESS',
    name: 'VIP Member Discount',
    type: 'PERCENTAGE',
    value: 25,
    minPurchase: 0,
    maxUses: 0,
    usedCount: 12,
    startDate: null,
    endDate: null,
    isActive: true,
    isOneTimeUse: true, // One-time use per customer
    applicableProducts: '',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'discount-6',
    code: 'SUMMER2024',
    name: 'Summer Sale (Expired)',
    type: 'PERCENTAGE',
    value: 30,
    minPurchase: 0,
    maxUses: 100,
    usedCount: 100,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    isActive: false, // Expired
    isOneTimeUse: false,
    applicableProducts: '',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'discount-7',
    code: 'BUNDLE25',
    name: 'Bundle Discount',
    type: 'FIXED',
    value: 25,
    minPurchase: 100,
    maxUses: 0,
    usedCount: 34,
    startDate: null,
    endDate: null,
    isActive: true,
    isOneTimeUse: false,
    applicableProducts: '',
    createdAt: new Date('2024-03-01'),
  },
];

export const mockDiscountStats = {
  totalCodes: 7,
  activeCodes: 5,
  totalUses: 441,
  totalSavings: 8923.45,
  usesThisMonth: 89,
  savingsThisMonth: 1567.89,
  mostUsedCode: {
    code: 'SAVE10',
    uses: 123,
  },
  topDiscount: {
    code: 'FLASH50',
    savings: 2456.78,
  },
};
