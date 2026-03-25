# CreatorHub - System Architecture

> **Platform Name:** CreatorHub
> **Architecture Type:** Full-Stack Next.js Application
> **Last Updated:** Current Session

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 16 App Router + React 19 + TypeScript                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Homepage  │ │   Store     │ │  Dashboard  │               │
│  │   (Public)  │ │  (Public)   │ │  (Private)  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Auth      │ │   Product   │ │   Course    │               │
│  │   Pages     │ │   Pages     │ │   Pages     │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (App Router)                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  /api/auth  │ │ /api/store  │ │/api/products│               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ /api/orders │ │/api/courses │ │/api/payments│               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICES LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Prisma    │ │   NextAuth  │ │   Stripe    │               │
│  │     ORM     │ │     v4      │ │   Payments  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   PayPal    │ │   Z-AI SDK  │ │   Sharp     │               │
│  │   Payments  │ │   (LLM/Gen) │ │   Images    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SQLite (Prisma)                       │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │   │
│  │  │   Users   │ │ Products  │ │  Orders   │             │   │
│  │  └───────────┘ └───────────┘ └───────────┘             │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │   │
│  │  │ Courses   │ │ Enrollments│ │  Files   │             │   │
│  │  └───────────┘ └───────────┘ └───────────┘             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | Full-stack framework | 16.x |
| React | UI library | 19.x |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 4.x |
| shadcn/ui | Component library | Latest |
| Framer Motion | Animations | 12.x |
| Zustand | Client state | 5.x |
| TanStack Query | Server state | 5.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | REST API | 16.x |
| Prisma | ORM | 6.x |
| NextAuth.js | Authentication | 4.x |
| Z-AI SDK | AI capabilities | Latest |
| Stripe | Payments | Latest |
| PayPal SDK | Payments | Latest |

### Database
| Technology | Purpose | Notes |
|------------|---------|-------|
| SQLite | Primary database | Development |
| Prisma Client | Database client | Type-safe queries |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Bun | Package manager & runtime |
| TypeScript | Type checking |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── courses/
│   │   │   ├── customers/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   ├── (store)/                  # Public store routes
│   │   └── [username]/
│   │       ├── page.tsx         # Store homepage
│   │       ├── product/[id]/
│   │       └── course/[id]/
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── courses/
│   │   ├── payments/
│   │   └── upload/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── store/                    # Store components
│   │   ├── StoreCard.tsx
│   │   ├── ProductCard.tsx
│   │   └── SocialLinks.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── StatsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   └── RecentOrders.tsx
│   └── forms/                    # Form components
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useGhostMode.ts
│   ├── useStore.ts
│   └── useToast.ts
│
├── lib/                          # Utility libraries
│   ├── db.ts                     # Prisma client
│   ├── utils.ts                  # Utility functions
│   ├── auth.ts                   # NextAuth config
│   ├── stripe.ts                 # Stripe config
│   └── paypal.ts                 # PayPal config
│
├── types/                        # TypeScript types
│   ├── index.ts
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
│
├── store/                        # Zustand stores
│   ├── useGhostStore.ts
│   └── useCartStore.ts
│
└── config/                       # Configuration
    ├── constants.ts
    └── navigation.ts

prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Seed data

public/
├── images/
├── icons/
└── fonts/
```

---

## 🗄️ Database Schema

### Core Tables

```prisma
// Users
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  username      String    @unique
  password      String?
  image         String?
  bio           String?
  coverImage    String?
  role          Role      @default(CREATOR)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  products      Product[]
  orders        Order[]
  courses       Course[]
  enrollments   Enrollment[]
  socialLinks   SocialLink[]
  storeSettings StoreSettings?
  
  @@map("users")
}

// Products
model Product {
  id          String      @id @default(cuid())
  title       String
  description String?
  price       Float
  images      String[]    @default([])
  files       String[]    @default([])
  category    String?
  featured    Boolean     @default(false)
  published   Boolean     @default(false)
  salesCount  Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  creatorId   String
  creator     User        @relation(fields: [creatorId], references: [id])
  orders      OrderItem[]
  
  @@map("products")
}

// Orders
model Order {
  id            String      @id @default(cuid())
  status        OrderStatus @default(PENDING)
  total         Float
  currency      String      @default("USD")
  paymentMethod String?
  paymentId     String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  buyerId       String
  buyer         User        @relation(fields: [buyerId], references: [id])
  items         OrderItem[]
  
  @@map("orders")
}

// Courses
model Course {
  id          String       @id @default(cuid())
  title       String
  description String?
  image       String?
  price       Float
  published   Boolean      @default(false)
  enrollmentCount Int      @default(0)
  rating      Float        @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  creatorId   String
  creator     User         @relation(fields: [creatorId], references: [id])
  modules     Module[]
  enrollments Enrollment[]
  
  @@map("courses")
}

// Modules
model Module {
  id          String     @id @default(cuid())
  title       String
  order       Int        @default(0)
  
  courseId    String
  course      Course     @relation(fields: [courseId], references: [id])
  lessons     Lesson[]
  
  @@map("modules")
}

// Lessons
model Lesson {
  id          String   @id @default(cuid())
  title       String
  description String?
  videoUrl    String?
  videoType   String?  // youtube, vimeo
  duration    Int?
  order       Int      @default(0)
  preview     Boolean  @default(false)
  
  moduleId    String
  module      Module   @relation(fields: [moduleId], references: [id])
  progress    LessonProgress[]
  
  @@map("lessons")
}

// Enrollment
model Enrollment {
  id          String   @id @default(cuid())
  progress    Float    @default(0)
  enrolledAt  DateTime @default(now())
  completedAt DateTime?
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  progress    LessonProgress[]
  
  @@unique([userId, courseId])
  @@map("enrollments")
}

// Lesson Progress
model LessonProgress {
  id          String   @id @default(cuid())
  completed   Boolean  @default(false)
  completedAt DateTime?
  
  enrollmentId String
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id])
  lessonId     String
  lesson       Lesson     @relation(fields: [lessonId], references: [id])
  
  @@unique([enrollmentId, lessonId])
  @@map("lesson_progress")
}

// Social Links
model SocialLink {
  id       String @id @default(cuid())
  platform String
  url      String
  order    Int    @default(0)
  
  userId   String
  user     User   @relation(fields: [userId], references: [id])
  
  @@map("social_links")
}

// Store Settings
model StoreSettings {
  id           String @id @default(cuid())
  theme        String @default("blue")
  primaryColor String @default("#2563eb")
  darkMode     Boolean @default(false)
  
  userId       String @unique
  user         User   @relation(fields: [userId], references: [id])
  
  @@map("store_settings")
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. Email/Password Login
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │  User   │────▶│  API    │────▶│ Prisma  │
   │ Input   │     │ Verify  │     │  DB     │
   └─────────┘     └─────────┘     └─────────┘
                        │
                        ▼
   ┌─────────┐     ┌─────────┐
   │  JWT    │◀────│ Session │
   │ Token   │     │ Created │
   └─────────┘     └─────────┘

2. Google OAuth
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Google  │────▶│NextAuth │────▶│ Create/ │
   │  Auth   │     │Callback │     │ FindUser│
   └─────────┘     └─────────┘     └─────────┘

3. Ghost Mode (Admin)
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Ghost   │────▶│ Bypass  │────▶│ Mock    │
   │ Toggle  │     │ Login   │     │ Data    │
   └─────────┘     └─────────┘     └─────────┘
```

---

## 💳 Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                            │
└─────────────────────────────────────────────────────────────┘

1. Checkout Initiation
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Customer│────▶│ Checkout│────▶│ Payment │
   │         │     │  Page   │     │ Provider│
   └─────────┘     └─────────┘     └─────────┘

2. Stripe Flow
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Stripe  │────▶│ Webhook │────▶│ Order   │
   │ Checkout│     │ Handler │     │ Created │
   └─────────┘     └─────────┘     └─────────┘

3. PayPal Flow
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ PayPal  │────▶│ IPN     │────▶│ Order   │
   │ Checkout│     │ Handler │     │ Created │
   └─────────┘     └─────────┘     └─────────┘

4. Order Completion
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Order   │────▶│ Email   │────▶│ Download│
   │ Created │     │ Sent    │     │ Access  │
   └─────────┘     └─────────┘     └─────────┘
```

---

## 🎨 Design System

### Color Palette (Blue Monochrome)

```css
/* Primary Blues */
--blue-50:  #eff6ff;
--blue-100: #dbeafe;
--blue-200: #bfdbfe;
--blue-300: #93c5fd;
--blue-400: #60a5fa;
--blue-500: #3b82f6;
--blue-600: #2563eb;  /* Primary */
--blue-700: #1d4ed8;
--blue-800: #1e40af;
--blue-900: #1e3a8a;
--blue-950: #172554;

/* Neutral (Gray-Blue) */
--slate-50:  #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
```

### Typography

```css
/* Font Family */
font-family: 'Montserrat', sans-serif;

/* Font Weights */
--font-light:    300;
--font-regular:  400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* Font Sizes */
--text-xs:   0.75rem;    /* 12px */
--text-sm:   0.875rem;   /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg:   1.125rem;   /* 18px */
--text-xl:   1.25rem;    /* 20px */
--text-2xl:  1.5rem;     /* 24px */
--text-3xl:  1.875rem;   /* 30px */
--text-4xl:  2.25rem;    /* 36px */
--text-5xl:  3rem;       /* 48px */
```

### Spacing Scale

```css
/* Tailwind Default Scale */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm:  640px;   /* Small devices */
md:  768px;   /* Tablets */
lg:  1024px;  /* Laptops */
xl:  1280px;  /* Desktops */
2xl: 1536px;  /* Large screens */
```

---

## 🚀 Performance Optimizations

### 1. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic with App Router)
- Lazy loading for images and videos

### 2. Image Optimization
- Next.js Image component with Sharp
- WebP format with fallbacks
- Responsive image sizes
- Lazy loading below the fold

### 3. Caching Strategy
- Static page generation where possible
- API response caching
- Database query caching with Prisma
- Edge caching for static assets

### 4. Bundle Size
- Tree shaking
- Minification
- Compression (gzip/brotli)
- No unnecessary dependencies

---

## 🔄 State Management

### Client State (Zustand)
```typescript
// Ghost Mode Store
useGhostStore: {
  isGhostMode: boolean;
  toggleGhostMode: () => void;
  mockUser: MockUser | null;
}

// Cart Store
useCartStore: {
  items: CartItem[];
  addItem: (item) => void;
  removeItem: (id) => void;
  clearCart: () => void;
}
```

### Server State (TanStack Query)
```typescript
// Query Keys
queryKeys = {
  products: ['products'],
  product: (id) => ['product', id],
  orders: ['orders'],
  courses: ['courses'],
  analytics: ['analytics'],
}
```

---

## 📊 Analytics Events

```typescript
// Track Events
events = {
  // Page Views
  page_view: { page, userId },
  store_view: { storeId, visitorId },
  
  // Product Events
  product_view: { productId, storeId },
  product_purchase: { productId, orderId, amount },
  
  // Course Events
  course_enroll: { courseId, userId },
  lesson_complete: { lessonId, userId },
  
  // Conversion Events
  checkout_start: { cartId, items },
  checkout_complete: { orderId, amount },
}
```

---

*This architecture document is updated as development progresses.*
