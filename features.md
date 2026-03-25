# CreatorHub - Feature Documentation

> **Platform Name:** CreatorHub (placeholder name, easily changeable)
> **Last Updated:** Current Session
> **Version:** 1.0.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [MVP Features](#mvp-features)
3. [Future Features](#future-features)
4. [Feature Details](#feature-details)
5. [User Roles](#user-roles)
6. [Pricing Tiers](#pricing-tiers)

---

## Overview

CreatorHub is an all-in-one creator store platform similar to Stan Store. It enables creators to monetize their content through digital products, courses, bookings, and memberships - all from a single link-in-bio storefront.

### Core Value Proposition
- **All-in-One Platform:** Store, courses, bookings, email marketing in one place
- **Mobile-First:** Optimized for mobile visitors from social media
- **Easy Monetization:** Simple setup for selling digital products
- **Creator-Focused:** Built for content creators, coaches, and digital entrepreneurs

---

## MVP Features (Must-Have for Launch)

### Phase 1: Core Platform

#### ✅ 1. Link-in-Bio Store
- Mobile-first responsive storefront
- Customizable profile (name, bio, profile picture, cover image)
- Custom URL slug (e.g., `creatorhub.store/username`)
- Social media links integration
- Custom branding with blue monochrome theme
- Dark/Light mode support

#### ✅ 2. Digital Product Sales
- Product types: E-books, Templates, Digital Downloads
- File upload and delivery
- Product images and descriptions
- Pricing (free or paid)
- Product categories/collections

#### ✅ 3. Basic Course Hosting
- Video lessons (Vimeo/YouTube embed)
- Module/lesson organization
- Course preview
- Student enrollment
- Progress tracking

#### ✅ 4. Authentication System
- Email/password signup and login
- Social login (Google)
- Password reset
- Session management
- Ghost mode for admin testing

#### ✅ 5. Creator Dashboard
- Analytics overview
- Product management
- Order history
- Profile settings
- Store customization

#### ✅ 6. Payment Processing
- Stripe integration
- PayPal integration
- Global currency support
- Secure checkout

#### ✅ 7. Navigation & Layout
- Responsive navbar with ghost mode toggle
- Homepage with hero section
- Footer with essential links

---

## Future Features (Post-MVP)

### Phase 2: Enhanced Features

#### 🔄 Calendar & Bookings
- One-on-one coaching calls
- Group sessions/webinars
- Custom availability
- Google/Outlook calendar sync
- Timezone support
- Booking payment collection

#### 🔄 Email Marketing
- Email list building
- Welcome email automation
- Newsletter broadcasting
- Subscriber management
- Email analytics

#### 🔄 Membership/Subscription
- Tiered membership levels
- Exclusive member content
- Recurring payments
- Member community

#### 🔄 Advanced Course Features
- Quizzes and assessments
- Completion certificates
- Drip content
- Course completion tracking

### Phase 3: Growth Features

#### 🔮 Social Features
- Product reviews and ratings
- Comments on products
- Creator following
- Activity feed

#### 🔮 Affiliate Program
- Affiliate links for creators
- Commission tracking
- Payout management
- Affiliate dashboard

#### 🔮 AI Assistant
- AI-powered product descriptions
- Content suggestions
- Chatbot for customer support
- Analytics insights

#### 🔮 Advanced Analytics
- Revenue forecasting
- Conversion funnels
- A/B testing
- Custom reports

---

## Feature Details

### 1. Link-in-Bio Store

**Components:**
- Profile header (avatar, name, bio)
- Cover image
- Social links bar
- Product grid
- Featured products section
- Call-to-action buttons

**Customization:**
- Theme colors (blue monochrome default)
- Layout options
- Button styles
- Font sizes

### 2. Digital Products

**Product Schema:**
```
- ID
- Title
- Description
- Price
- Images (array)
- Files (array)
- Category
- Featured status
- Created date
- Sales count
```

**Features:**
- Drag-and-drop file upload
- Image gallery
- Rich text description
- Pricing options
- Inventory (optional)
- Download limits

### 3. Courses

**Course Schema:**
```
- ID
- Title
- Description
- Cover image
- Price
- Modules (array)
  - Lessons (array)
    - Video URL
    - Title
    - Description
    - Duration
- Enrollment count
- Rating
```

**Features:**
- Module/lesson structure
- Video embedding (Vimeo/YouTube)
- Progress tracking
- Preview lessons
- Student management

### 4. Authentication

**Features:**
- Secure password hashing
- JWT session tokens
- OAuth integration (Google)
- Email verification
- Password reset flow
- Session persistence
- Ghost mode (admin bypass)

### 5. Dashboard

**Pages:**
- Overview (analytics summary)
- Products (CRUD)
- Orders (list, details)
- Customers (list)
- Courses (management)
- Bookings (calendar)
- Settings (profile, store)
- Analytics (detailed)

### 6. Payments

**Integration:**
- Stripe Connect for creator payouts
- PayPal Commerce Platform
- Webhook handling
- Invoice generation
- Refund processing
- Tax calculation

---

## User Roles

### Single User Role: Creator

**Capabilities:**
- Manage their own store
- Create/edit products
- View orders and customers
- Access analytics
- Customize profile
- Manage courses
- Handle bookings (Phase 2)

**Admin Access:**
- Ghost mode toggle for testing
- Full platform access when enabled
- Mock data generation

---

## Pricing Tiers

### Free Plan
- 1 product
- Basic storefront
- 10% transaction fee
- Community support

### Starter Plan ($19/month)
- 10 products
- Custom domain
- 5% transaction fee
- Email support
- Basic analytics

### Pro Plan ($39/month)
- Unlimited products
- Custom branding
- 0% transaction fee
- Priority support
- Advanced analytics
- Email marketing (Phase 2)

### Premium Plan ($79/month)
- Everything in Pro
- Membership features
- Affiliate program
- AI assistant
- White-label option

---

## Technical Implementation Status

| Feature | Status | Priority |
|---------|--------|----------|
| Global Styles | 🔄 In Progress | High |
| Database Schema | 🔄 In Progress | High |
| Navbar + Ghost Mode | 🔄 In Progress | High |
| Homepage Hero | 🔄 In Progress | High |
| Authentication | ⏳ Pending | High |
| Dashboard Layout | ⏳ Pending | High |
| Store Pages | ⏳ Pending | High |
| Products System | ⏳ Pending | High |
| Courses System | ⏳ Pending | Medium |
| Payment Integration | ⏳ Pending | Medium |
| Calendar/Bookings | ⏳ Pending | Medium |
| Email Marketing | ⏳ Pending | Low |
| Analytics | ⏳ Pending | Medium |

---

*This document is updated as development progresses.*
