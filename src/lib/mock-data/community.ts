// Community mock data types
export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'ANNOUNCEMENT';

export interface MockPost {
  id: string;
  title: string;
  content: string;
  type: PostType;
  imageUrl?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo';
  isPinned: boolean;
  isLocked: boolean;
  isMemberOnly: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: {
    name: string;
    username: string;
    avatar?: string;
  };
  isLiked?: boolean;
}

export interface MockComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  authorId: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  parentId?: string;
  replies?: MockComment[];
}

// Mock posts data
export const mockPosts: MockPost[] = [
  {
    id: 'post-1',
    title: '🎉 Welcome to Our Exclusive Community!',
    content: `Hey everyone! 👋

I'm so excited to welcome you all to this exclusive community space. This is where we'll share behind-the-scenes content, early access to new products, and connect on a deeper level.

**What you can expect:**
- Exclusive tutorials and tips
- Early access to new releases
- Q&A sessions
- Community challenges
- Behind-the-scenes content

Thank you for being part of this journey. Let's create something amazing together! 🚀`,
    type: 'ANNOUNCEMENT',
    isPinned: true,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 1243,
    likeCount: 89,
    commentCount: 24,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: undefined,
    },
    isLiked: true,
  },
  {
    id: 'post-2',
    title: 'Behind the Scenes: My Content Creation Setup',
    content: `Ever wondered what my content creation setup looks like? Here's a sneak peek!

I've spent years perfecting this setup, and I'm finally happy with it. The key is finding what works for YOUR workflow.

**My essential gear:**
- Sony A7IV for video
- MacBook Pro M3 for editing
- Elgato Key Light for lighting
- Rode NT1-A for audio

Drop your questions below! 👇`,
    type: 'IMAGE',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800',
    isPinned: false,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 856,
    likeCount: 67,
    commentCount: 18,
    createdAt: new Date('2024-01-18T14:30:00Z'),
    updatedAt: new Date('2024-01-18T14:30:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: false,
  },
  {
    id: 'post-3',
    title: 'New Video: How I Grew to 100K Followers',
    content: `My latest video is live! 🎬

In this video, I break down exactly how I grew from 0 to 100K followers in under 2 years. No gatekeeping here - I share everything that worked (and what didn't).

**Topics covered:**
- Content strategy that actually works
- The algorithm myths you should ignore
- How to build genuine engagement
- Monetization tips for creators

Let me know what you think in the comments!`,
    type: 'VIDEO',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    isPinned: false,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 2341,
    likeCount: 156,
    commentCount: 42,
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: true,
  },
  {
    id: 'post-4',
    title: 'Community Challenge: 7-Day Content Sprint',
    content: `Who's ready for a challenge? 💪

Starting next Monday, we're doing a 7-day content sprint! The goal is to create and publish one piece of content every day for a week.

**Rules:**
1. Create one piece of content daily
2. Post it on your preferred platform
3. Share your progress in this thread
4. Support fellow community members

**Prizes:**
- Top 3 creators get a free 1-on-1 coaching session with me
- Everyone who completes gets a special badge

Who's in? Comment below! 🙌`,
    type: 'TEXT',
    isPinned: false,
    isLocked: false,
    isMemberOnly: true,
    viewCount: 432,
    likeCount: 78,
    commentCount: 35,
    createdAt: new Date('2024-01-22T11:00:00Z'),
    updatedAt: new Date('2024-01-22T11:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: false,
  },
  {
    id: 'post-5',
    title: 'Exclusive: Early Access to My New Course',
    content: `🔥 EXCLUSIVE COMMUNITY OFFER 🔥

Before I launch my new course "Creator Business Masterclass" to the public next week, I wanted to give you all early access!

**What's included:**
- 20+ hours of video content
- Live Q&A sessions
- Private community access
- Downloadable resources
- Certificate of completion

**Community price:** $97 (Public price: $197)

Use code COMMUNITY50 at checkout.

This is my way of saying thank you for being part of this community! 💙`,
    type: 'ANNOUNCEMENT',
    isPinned: true,
    isLocked: true,
    isMemberOnly: true,
    viewCount: 1876,
    likeCount: 234,
    commentCount: 0,
    createdAt: new Date('2024-01-25T16:00:00Z'),
    updatedAt: new Date('2024-01-25T16:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: true,
  },
  {
    id: 'post-6',
    title: 'My Morning Routine for Maximum Productivity',
    content: `A lot of you have been asking about my morning routine, so here it is!

**5:30 AM** - Wake up, no phone for first hour
**6:00 AM** - Workout (30 mins)
**6:30 AM** - Cold shower & meditation
**7:00 AM** - Healthy breakfast
**7:30 AM** - Content planning for the day
**8:00 AM** - Deep work session begins

The key isn't perfection - it's consistency. I've been doing this for 6 months now and the difference in my productivity is insane.

What does your morning routine look like?`,
    type: 'TEXT',
    isPinned: false,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 654,
    likeCount: 45,
    commentCount: 12,
    createdAt: new Date('2024-01-27T08:00:00Z'),
    updatedAt: new Date('2024-01-27T08:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: false,
  },
  {
    id: 'post-7',
    title: 'Quick Tip: The 80/20 Rule for Content',
    content: `Here's a principle that changed my content game:

**80% of your content should serve your audience.**
**20% can be promotional.**

Most creators get this backwards and wonder why engagement drops.

Your audience follows you for VALUE. Give them value first, and the sales will follow naturally.

Save this post for later! 📌`,
    type: 'TEXT',
    isPinned: false,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 892,
    likeCount: 123,
    commentCount: 8,
    createdAt: new Date('2024-01-28T13:00:00Z'),
    updatedAt: new Date('2024-01-28T13:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: true,
  },
  {
    id: 'post-8',
    title: 'Office Tour 2024',
    content: `Finally finished renovating my office! 🏠

This space is where all the magic happens. I wanted to create an environment that sparks creativity and keeps me focused.

Key elements:
- Natural light from two windows
- Minimal desk setup
- Plants for good vibes 🌱
- Inspiration board with goals

What do you think? Any suggestions for improvement?`,
    type: 'IMAGE',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    isPinned: false,
    isLocked: false,
    isMemberOnly: false,
    viewCount: 543,
    likeCount: 67,
    commentCount: 15,
    createdAt: new Date('2024-01-30T10:30:00Z'),
    updatedAt: new Date('2024-01-30T10:30:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: false,
  },
  {
    id: 'post-9',
    title: 'Monthly Q&A: Ask Me Anything!',
    content: `It's time for our monthly Q&A session! 🎤

Drop your questions below about:
- Content creation
- Growing on social media
- Monetization
- Business strategy
- Personal development

I'll be answering questions all week long. No question is too simple or too complex!

Let's learn together! 🚀`,
    type: 'TEXT',
    isPinned: false,
    isLocked: false,
    isMemberOnly: true,
    viewCount: 321,
    likeCount: 34,
    commentCount: 28,
    createdAt: new Date('2024-02-01T09:00:00Z'),
    updatedAt: new Date('2024-02-01T09:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: false,
  },
  {
    id: 'post-10',
    title: 'Workshop Recording: Building Your Personal Brand',
    content: `For those who missed last week's workshop, here's the full recording!

**In this workshop we covered:**
1. Defining your unique value proposition
2. Creating a consistent visual identity
3. Building authority in your niche
4. Networking strategies for introverts
5. Monetizing your personal brand

The workshop runs for about 90 minutes. Grab a notebook and let's dive in!

Timestamps in the video description.`,
    type: 'VIDEO',
    videoUrl: 'https://player.vimeo.com/video/123456789',
    videoType: 'vimeo',
    isPinned: false,
    isLocked: false,
    isMemberOnly: true,
    viewCount: 1567,
    likeCount: 89,
    commentCount: 22,
    createdAt: new Date('2024-02-03T15:00:00Z'),
    updatedAt: new Date('2024-02-03T15:00:00Z'),
    creatorId: 'ghost-user-id',
    creator: {
      name: 'John Doe',
      username: 'johndoe',
    },
    isLiked: true,
  },
];

// Mock comments data
export const mockComments: MockComment[] = [
  // Comments for post-1
  {
    id: 'comment-1',
    content: 'So excited to be here! This community is going to be amazing! 🎉',
    createdAt: new Date('2024-01-15T11:30:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z'),
    postId: 'post-1',
    authorId: 'user-1',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
    },
    replies: [
      {
        id: 'comment-1-1',
        content: 'Welcome Sarah! Great to have you here! 💙',
        createdAt: new Date('2024-01-15T12:00:00Z'),
        updatedAt: new Date('2024-01-15T12:00:00Z'),
        postId: 'post-1',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-1',
      },
    ],
  },
  {
    id: 'comment-2',
    content: "I've been following your content for years. So happy to finally have a space to connect more directly!",
    createdAt: new Date('2024-01-15T13:45:00Z'),
    updatedAt: new Date('2024-01-15T13:45:00Z'),
    postId: 'post-1',
    authorId: 'user-2',
    author: {
      name: 'Mike Johnson',
      username: 'mikej',
    },
  },
  {
    id: 'comment-3',
    content: 'What type of exclusive content can we expect? This sounds really promising!',
    createdAt: new Date('2024-01-15T14:20:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
    postId: 'post-1',
    authorId: 'user-3',
    author: {
      name: 'Emily Davis',
      username: 'emilyd',
    },
    replies: [
      {
        id: 'comment-3-1',
        content: "Great question! You can expect early access to courses, behind-the-scenes content, live Q&As, and exclusive tutorials. I'll also share resources I don't post anywhere else!",
        createdAt: new Date('2024-01-15T15:00:00Z'),
        updatedAt: new Date('2024-01-15T15:00:00Z'),
        postId: 'post-1',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-3',
      },
      {
        id: 'comment-3-2',
        content: 'That sounds amazing! Count me in for the Q&As! 🙋‍♀️',
        createdAt: new Date('2024-01-15T15:30:00Z'),
        updatedAt: new Date('2024-01-15T15:30:00Z'),
        postId: 'post-1',
        authorId: 'user-3',
        author: {
          name: 'Emily Davis',
          username: 'emilyd',
        },
        parentId: 'comment-3',
      },
    ],
  },
  // Comments for post-2
  {
    id: 'comment-4',
    content: 'What mic would you recommend for beginners? The Rode NT1-A seems a bit pricey for someone just starting out.',
    createdAt: new Date('2024-01-18T15:00:00Z'),
    updatedAt: new Date('2024-01-18T15:00:00Z'),
    postId: 'post-2',
    authorId: 'user-4',
    author: {
      name: 'Alex Thompson',
      username: 'alext',
    },
    replies: [
      {
        id: 'comment-4-1',
        content: "Great question! For beginners, I'd recommend the Blue Yeti or Audio-Technica AT2020. Both are excellent and more budget-friendly. The AT2020 is what I started with!",
        createdAt: new Date('2024-01-18T16:00:00Z'),
        updatedAt: new Date('2024-01-18T16:00:00Z'),
        postId: 'post-2',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-4',
      },
    ],
  },
  {
    id: 'comment-5',
    content: 'Love the setup! That Elgato Key Light is a game changer, right? Best purchase I made last year.',
    createdAt: new Date('2024-01-18T17:30:00Z'),
    updatedAt: new Date('2024-01-18T17:30:00Z'),
    postId: 'post-2',
    authorId: 'user-5',
    author: {
      name: 'Jordan Lee',
      username: 'jordanl',
    },
  },
  // Comments for post-3
  {
    id: 'comment-6',
    content: 'Just watched the full video. The tip about ignoring algorithm myths was SO helpful. I spent months chasing the algorithm instead of creating good content.',
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-01-20T10:30:00Z'),
    postId: 'post-3',
    authorId: 'user-6',
    author: {
      name: 'Chris Park',
      username: 'chrisp',
    },
    replies: [
      {
        id: 'comment-6-1',
        content: "Exactly! The algorithm rewards good content that keeps people engaged. Focus on value, not hacks!",
        createdAt: new Date('2024-01-20T11:00:00Z'),
        updatedAt: new Date('2024-01-20T11:00:00Z'),
        postId: 'post-3',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-6',
      },
    ],
  },
  {
    id: 'comment-7',
    content: 'Can you do a follow-up video on monetization? That section was too short! 😅',
    createdAt: new Date('2024-01-20T12:00:00Z'),
    updatedAt: new Date('2024-01-20T12:00:00Z'),
    postId: 'post-3',
    authorId: 'user-7',
    author: {
      name: 'Rachel Kim',
      username: 'rachelk',
    },
    replies: [
      {
        id: 'comment-7-1',
        content: "Noted! I'm planning a dedicated monetization deep-dive for next month. Stay tuned!",
        createdAt: new Date('2024-01-20T13:00:00Z'),
        updatedAt: new Date('2024-01-20T13:00:00Z'),
        postId: 'post-3',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-7',
      },
    ],
  },
  // Comments for post-4
  {
    id: 'comment-8',
    content: "I'M IN! 🔥 Been needing something like this to push me out of my comfort zone.",
    createdAt: new Date('2024-01-22T11:30:00Z'),
    updatedAt: new Date('2024-01-22T11:30:00Z'),
    postId: 'post-4',
    authorId: 'user-1',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
    },
  },
  {
    id: 'comment-9',
    content: 'Count me in too! What platform should we post to? Any preference?',
    createdAt: new Date('2024-01-22T12:00:00Z'),
    updatedAt: new Date('2024-01-22T12:00:00Z'),
    postId: 'post-4',
    authorId: 'user-8',
    author: {
      name: 'David Wilson',
      username: 'davidw',
    },
    replies: [
      {
        id: 'comment-9-1',
        content: 'Any platform works! Instagram, TikTok, YouTube, Twitter - wherever your audience is. The key is consistency.',
        createdAt: new Date('2024-01-22T12:30:00Z'),
        updatedAt: new Date('2024-01-22T12:30:00Z'),
        postId: 'post-4',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-9',
      },
    ],
  },
  {
    id: 'comment-10',
    content: 'This is exactly what I needed. Been in a creative slump lately.',
    createdAt: new Date('2024-01-22T14:00:00Z'),
    updatedAt: new Date('2024-01-22T14:00:00Z'),
    postId: 'post-4',
    authorId: 'user-9',
    author: {
      name: 'Lisa Brown',
      username: 'lisab',
    },
  },
  // Comments for post-6
  {
    id: 'comment-11',
    content: '5:30 AM?! 😱 I can barely wake up at 8. Any tips for becoming a morning person?',
    createdAt: new Date('2024-01-27T09:00:00Z'),
    updatedAt: new Date('2024-01-27T09:00:00Z'),
    postId: 'post-6',
    authorId: 'user-10',
    author: {
      name: 'Tom Martinez',
      username: 'tomm',
    },
    replies: [
      {
        id: 'comment-11-1',
        content: "Start small! Try waking up just 15 minutes earlier each week. And the key is having something to look forward to in the morning - for me it's a quiet coffee before the world wakes up.",
        createdAt: new Date('2024-01-27T10:00:00Z'),
        updatedAt: new Date('2024-01-27T10:00:00Z'),
        postId: 'post-6',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-11',
      },
    ],
  },
  {
    id: 'comment-12',
    content: 'The "no phone for first hour" rule changed my life. Highly recommend trying it!',
    createdAt: new Date('2024-01-27T11:00:00Z'),
    updatedAt: new Date('2024-01-27T11:00:00Z'),
    postId: 'post-6',
    authorId: 'user-2',
    author: {
      name: 'Mike Johnson',
      username: 'mikej',
    },
  },
  // Comments for post-7
  {
    id: 'comment-13',
    content: 'This is gold! 🏆 I used to post promotional content all the time and wondered why no one engaged.',
    createdAt: new Date('2024-01-28T14:00:00Z'),
    updatedAt: new Date('2024-01-28T14:00:00Z'),
    postId: 'post-7',
    authorId: 'user-4',
    author: {
      name: 'Alex Thompson',
      username: 'alext',
    },
  },
  {
    id: 'comment-14',
    content: 'Saved! This is something I need to keep reminding myself of.',
    createdAt: new Date('2024-01-28T15:30:00Z'),
    updatedAt: new Date('2024-01-28T15:30:00Z'),
    postId: 'post-7',
    authorId: 'user-6',
    author: {
      name: 'Chris Park',
      username: 'chrisp',
    },
  },
  // Comments for post-8
  {
    id: 'comment-15',
    content: 'Love the minimal aesthetic! What desk is that? Looks super clean.',
    createdAt: new Date('2024-01-30T11:00:00Z'),
    updatedAt: new Date('2024-01-30T11:00:00Z'),
    postId: 'post-8',
    authorId: 'user-5',
    author: {
      name: 'Jordan Lee',
      username: 'jordanl',
    },
    replies: [
      {
        id: 'comment-15-1',
        content: "It's the Autonomous SmartDesk! The standing feature has been great for long work sessions.",
        createdAt: new Date('2024-01-30T12:00:00Z'),
        updatedAt: new Date('2024-01-30T12:00:00Z'),
        postId: 'post-8',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-15',
      },
    ],
  },
  {
    id: 'comment-16',
    content: 'Plants are the best addition! Which ones do you have? I need some low-maintenance options.',
    createdAt: new Date('2024-01-30T13:00:00Z'),
    updatedAt: new Date('2024-01-30T13:00:00Z'),
    postId: 'post-8',
    authorId: 'user-11',
    author: {
      name: 'Amy Nguyen',
      username: 'amyn',
    },
    replies: [
      {
        id: 'comment-16-1',
        content: 'Snake plants and ZZ plants are super low maintenance! They can survive almost anything 😅',
        createdAt: new Date('2024-01-30T14:00:00Z'),
        updatedAt: new Date('2024-01-30T14:00:00Z'),
        postId: 'post-8',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-16',
      },
    ],
  },
  // Comments for post-9
  {
    id: 'comment-17',
    content: "How do you deal with imposter syndrome? Sometimes I feel like I'm not qualified to teach others.",
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T10:00:00Z'),
    postId: 'post-9',
    authorId: 'user-7',
    author: {
      name: 'Rachel Kim',
      username: 'rachelk',
    },
    replies: [
      {
        id: 'comment-17-1',
        content: "This is such a common feeling! Remember: you don't need to be an expert, just a few steps ahead of the people you're helping. Also, focus on sharing your journey, not being perfect.",
        createdAt: new Date('2024-02-01T11:00:00Z'),
        updatedAt: new Date('2024-02-01T11:00:00Z'),
        postId: 'post-9',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-17',
      },
    ],
  },
  {
    id: 'comment-18',
    content: "What's your process for coming up with content ideas? I often feel stuck.",
    createdAt: new Date('2024-02-01T12:00:00Z'),
    updatedAt: new Date('2024-02-01T12:00:00Z'),
    postId: 'post-9',
    authorId: 'user-12',
    author: {
      name: 'Kevin Zhao',
      username: 'kevinz',
    },
    replies: [
      {
        id: 'comment-18-1',
        content: "Great question! I keep a running notes app where I write down every idea, question, or observation. I also look at comments and DMs for inspiration - what are people asking about?",
        createdAt: new Date('2024-02-01T13:00:00Z'),
        updatedAt: new Date('2024-02-01T13:00:00Z'),
        postId: 'post-9',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-18',
      },
    ],
  },
  {
    id: 'comment-19',
    content: 'Any advice for someone trying to grow on LinkedIn? The platform feels different from others.',
    createdAt: new Date('2024-02-01T14:00:00Z'),
    updatedAt: new Date('2024-02-01T14:00:00Z'),
    postId: 'post-9',
    authorId: 'user-3',
    author: {
      name: 'Emily Davis',
      username: 'emilyd',
    },
  },
  // Comments for post-10
  {
    id: 'comment-20',
    content: "This workshop was incredible! I've already started implementing the personal brand framework. Thank you for sharing this!",
    createdAt: new Date('2024-02-03T16:00:00Z'),
    updatedAt: new Date('2024-02-03T16:00:00Z'),
    postId: 'post-10',
    authorId: 'user-1',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
    },
  },
  {
    id: 'comment-21',
    content: 'The section on networking for introverts was eye-opening. Never thought of it that way before.',
    createdAt: new Date('2024-02-03T17:00:00Z'),
    updatedAt: new Date('2024-02-03T17:00:00Z'),
    postId: 'post-10',
    authorId: 'user-9',
    author: {
      name: 'Lisa Brown',
      username: 'lisab',
    },
    replies: [
      {
        id: 'comment-21-1',
        content: 'Glad it resonated! The key is quality over quantity. One meaningful conversation is worth 50 business cards.',
        createdAt: new Date('2024-02-03T18:00:00Z'),
        updatedAt: new Date('2024-02-03T18:00:00Z'),
        postId: 'post-10',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-21',
      },
    ],
  },
  {
    id: 'comment-22',
    content: 'Is there a downloadable version available? Would love to watch this on my commute.',
    createdAt: new Date('2024-02-03T19:00:00Z'),
    updatedAt: new Date('2024-02-03T19:00:00Z'),
    postId: 'post-10',
    authorId: 'user-8',
    author: {
      name: 'David Wilson',
      username: 'davidw',
    },
    replies: [
      {
        id: 'comment-22-1',
        content: "I'll look into that! In the meantime, you can use browser extensions to save videos for offline viewing.",
        createdAt: new Date('2024-02-03T20:00:00Z'),
        updatedAt: new Date('2024-02-03T20:00:00Z'),
        postId: 'post-10',
        authorId: 'ghost-user-id',
        author: {
          name: 'John Doe',
          username: 'johndoe',
        },
        parentId: 'comment-22',
      },
    ],
  },
];

// Helper functions
export function getMockPosts(): MockPost[] {
  return mockPosts.sort((a, b) => {
    // Pinned posts first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by date
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export function getMockPostById(id: string): MockPost | undefined {
  return mockPosts.find((post) => post.id === id);
}

export function getMockCommentsByPostId(postId: string): MockComment[] {
  const postComments = mockComments.filter((comment) => comment.postId === postId);
  // Only return top-level comments (no parentId)
  return postComments.filter((comment) => !comment.parentId);
}

export function getMockCommentById(id: string): MockComment | undefined {
  return mockComments.find((comment) => comment.id === id);
}

export function getMockPostByCreatorId(creatorId: string): MockPost[] {
  return mockPosts.filter((post) => post.creatorId === creatorId);
}

export function getCommunityStats() {
  return {
    totalPosts: mockPosts.length,
    totalComments: mockComments.length,
    totalLikes: mockPosts.reduce((acc, post) => acc + post.likeCount, 0),
    totalViews: mockPosts.reduce((acc, post) => acc + post.viewCount, 0),
    pinnedPosts: mockPosts.filter((post) => post.isPinned).length,
    memberOnlyPosts: mockPosts.filter((post) => post.isMemberOnly).length,
  };
}
