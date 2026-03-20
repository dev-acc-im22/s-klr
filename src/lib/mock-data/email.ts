// Mock data for Email Marketing feature

export interface MockSubscriber {
  id: string
  email: string
  name: string | null
  isActive: boolean
  tags: string[]
  subscribedAt: string
  unsubscribedAt: string | null
  openRate: number // percentage
  clickRate: number // percentage
  emailsReceived: number
  emailsOpened: number
  linksClicked: number
}

export interface MockCampaign {
  id: string
  subject: string
  previewText: string
  content: string
  status: 'DRAFT' | 'SCHEDULED' | 'SENT'
  scheduledAt: string | null
  sentAt: string | null
  recipientCount: number
  openCount: number
  clickCount: number
  unsubscribeCount: number
  template: 'welcome' | 'newsletter' | 'promotion' | 'custom'
  createdAt: string
  updatedAt: string
}

// First names for generating realistic mock data
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Isabella', 'Elijah',
  'Sophia', 'Lucas', 'Mia', 'Mason', 'Charlotte', 'Logan', 'Amelia', 'James',
  'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Alexander', 'Emily', 'Michael',
  'Elizabeth', 'Daniel', 'Sofia', 'Jacob', 'Avery', 'William', 'Ella', 'Sebastian',
  'Scarlett', 'Jack', 'Grace', 'Owen', 'Chloe', 'Aiden', 'Victoria', 'Samuel',
  'Riley', 'Ryan', 'Aria', 'John', 'Lily', 'Luke', 'Aurora', 'Carter',
  'Zoey', 'Jayden'
]

// Last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts'
]

// Email domains
const domains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'proton.me', 'mail.com', 'aol.com', 'live.com', 'me.com'
]

// Tags for subscribers
const allTags = [
  'customer', 'lead', 'newsletter', 'course-buyer', 'product-buyer',
  'engaged', 'inactive', 'vip', 'new', 'returning'
]

// Generate 50 mock subscribers
export const mockSubscribers: MockSubscriber[] = Array.from({ length: 50 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[index % lastNames.length]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`
  
  // Random subscription date within last 6 months
  const subscribedDays = Math.floor(Math.random() * 180) + 1
  const subscribedAt = new Date(Date.now() - subscribedDays * 24 * 60 * 60 * 1000).toISOString()
  
  // Some subscribers might be inactive
  const isActive = Math.random() > 0.1 // 90% active
  const unsubscribedAt = !isActive 
    ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString() 
    : null
  
  // Random tags (1-3 tags per subscriber)
  const numTags = Math.floor(Math.random() * 3) + 1
  const tags: string[] = []
  for (let i = 0; i < numTags; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)]
    if (!tags.includes(tag)) tags.push(tag)
  }
  
  // Engagement metrics
  const emailsReceived = Math.floor(Math.random() * 15) + 1
  const emailsOpened = Math.floor(emailsReceived * (0.3 + Math.random() * 0.5))
  const linksClicked = Math.floor(emailsOpened * Math.random() * 0.5)
  const openRate = emailsReceived > 0 ? Math.round((emailsOpened / emailsReceived) * 100) : 0
  const clickRate = emailsOpened > 0 ? Math.round((linksClicked / emailsOpened) * 100) : 0

  return {
    id: `sub_${String(index + 1).padStart(3, '0')}`,
    email,
    name: `${firstName} ${lastName}`,
    isActive,
    tags,
    subscribedAt,
    unsubscribedAt,
    openRate,
    clickRate,
    emailsReceived,
    emailsOpened,
    linksClicked
  }
})

// Email templates
export const emailTemplates = {
  welcome: {
    name: 'Welcome Email',
    subject: 'Welcome to {{creator_name}}\'s community!',
    preview: 'Thanks for subscribing - here\'s what to expect',
    content: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px;">Welcome to the community! 🎉</h1>
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Hi {{subscriber_name}},
        </p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Thanks for subscribing! I'm so excited to have you here. You'll be the first to know about:
        </p>
        <ul style="color: #334155; font-size: 16px; line-height: 1.8; margin-bottom: 24px;">
          <li>New products and courses</li>
          <li>Exclusive discounts and offers</li>
          <li>Behind-the-scenes content</li>
          <li>Tips and tutorials</li>
        </ul>
        <a href="{{store_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Visit My Store
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          Best,<br>{{creator_name}}
        </p>
      </div>
    `
  },
  newsletter: {
    name: 'Newsletter',
    subject: '{{creator_name}}\'s Weekly Update',
    preview: 'Your weekly dose of tips and updates',
    content: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #1e40af; font-size: 24px; margin-bottom: 20px;">📰 Weekly Newsletter</h1>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
          <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">💡 This Week's Highlights</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            {{highlights}}
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">🎯 Featured Content</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            {{featured_content}}
          </p>
        </div>

        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">🔥 Special Offer</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            {{offer}}
          </p>
        </div>

        <p style="color: #64748b; font-size: 14px; margin-top: 24px; text-align: center;">
          You're receiving this email because you subscribed to {{creator_name}}'s newsletter.
        </p>
      </div>
    `
  },
  promotion: {
    name: 'Promotion',
    subject: '🎉 Special Offer Just For You!',
    preview: 'Don\'t miss this exclusive deal',
    content: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px;">
        <h1 style="color: #1e40af; font-size: 32px; margin-bottom: 16px; text-align: center;">🎉 Special Offer!</h1>
        
        <div style="background: white; padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Limited Time Offer</p>
          <h2 style="color: #1e40af; font-size: 48px; font-weight: 800; margin-bottom: 8px;">{{discount}}% OFF</h2>
          <p style="color: #334155; font-size: 18px;">{{product_name}}</p>
        </div>

        <p style="color: #334155; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 24px;">
          Hi {{subscriber_name}},<br><br>
          {{offer_description}}
        </p>

        <div style="text-align: center;">
          <a href="{{store_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px;">
            Claim Your Discount →
          </a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; text-align: center;">
          Offer expires: {{expiry_date}}
        </p>
      </div>
    `
  }
}

// 3 Mock campaigns
export const mockCampaigns: MockCampaign[] = [
  {
    id: 'camp_001',
    subject: 'Welcome to CreatorHub Community!',
    previewText: 'Thanks for joining - here\'s what to expect',
    content: emailTemplates.welcome.content,
    status: 'SENT',
    scheduledAt: null,
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    recipientCount: 48,
    openCount: 32,
    clickCount: 18,
    unsubscribeCount: 1,
    template: 'welcome',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'camp_002',
    subject: 'Weekly Newsletter - New Course Launch!',
    previewText: 'Check out our latest content and offerings',
    content: emailTemplates.newsletter.content,
    status: 'SENT',
    scheduledAt: null,
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    recipientCount: 50,
    openCount: 28,
    clickCount: 15,
    unsubscribeCount: 0,
    template: 'newsletter',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'camp_003',
    subject: '🎉 Flash Sale - 30% Off All Products!',
    previewText: '48-hour exclusive discount for subscribers',
    content: emailTemplates.promotion.content,
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // In 2 days
    sentAt: null,
    recipientCount: 0,
    openCount: 0,
    clickCount: 0,
    unsubscribeCount: 0,
    template: 'promotion',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Email Template Type
export type EmailTemplateType = 'WELCOME' | 'PURCHASE_CONFIRMATION' | 'COURSE_ENROLLMENT' | 'ABANDONED_CART' | 'RECOVERY' | 'NEWSLETTER'

// Mock Email Template
export interface MockEmailTemplate {
  id: string
  type: EmailTemplateType
  subject: string
  body: string
  variables: string[] // Available variable names
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Default email templates with pre-built content
export const defaultEmailTemplates: MockEmailTemplate[] = [
  {
    id: 'tpl_welcome',
    type: 'WELCOME',
    subject: 'Welcome to {{creator_name}}\'s community!',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px;">Welcome to the community! 🎉</h1>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi {{name}},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Thanks for subscribing! I'm so excited to have you here. You'll be the first to know about:
      </p>
      <ul style="color: #334155; font-size: 16px; line-height: 1.8; margin-bottom: 24px;">
        <li>New products and courses</li>
        <li>Exclusive discounts and offers</li>
        <li>Behind-the-scenes content</li>
        <li>Tips and tutorials</li>
      </ul>
      <a href="{{store_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Visit My Store
      </a>
      <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
        Best,<br>{{creator_name}}
      </p>
    </div>`,
    variables: ['name', 'creator_name', 'store_url', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tpl_purchase',
    type: 'PURCHASE_CONFIRMATION',
    subject: 'Thank you for your purchase!',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px;">Order Confirmed! ✅</h1>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi {{name}},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for your purchase! Your order has been confirmed.
      </p>
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">Order Details</h2>
        <p style="color: #334155; font-size: 15px;"><strong>Product:</strong> {{product}}</p>
        <p style="color: #334155; font-size: 15px;"><strong>Amount:</strong> {{price}}</p>
        <p style="color: #334155; font-size: 15px;"><strong>Order ID:</strong> {{order_id}}</p>
      </div>
      <a href="{{store_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Access Your Purchase
      </a>
      <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
        Best,<br>{{creator_name}}
      </p>
    </div>`,
    variables: ['name', 'product', 'price', 'order_id', 'creator_name', 'store_url', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tpl_course',
    type: 'COURSE_ENROLLMENT',
    subject: 'You\'re enrolled in {{course_name}}!',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px;">Welcome to the Course! 🎓</h1>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi {{name}},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        You've been enrolled in <strong>{{course_name}}</strong>. Get ready to learn and grow!
      </p>
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">Course Details</h2>
        <p style="color: #334155; font-size: 15px;"><strong>Modules:</strong> {{module_count}}</p>
        <p style="color: #334155; font-size: 15px;"><strong>Duration:</strong> {{duration}}</p>
      </div>
      <a href="{{course_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Start Learning Now
      </a>
      <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
        Best,<br>{{creator_name}}
      </p>
    </div>`,
    variables: ['name', 'course_name', 'module_count', 'duration', 'course_url', 'creator_name', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tpl_abandoned',
    type: 'ABANDONED_CART',
    subject: 'You left something in your cart 🛒',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px;">Don't Miss Out! 🛒</h1>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi {{name}},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        You have items waiting in your cart. Complete your purchase before they're gone!
      </p>
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">Your Cart</h2>
        <p style="color: #334155; font-size: 15px;"><strong>Items:</strong> {{cart_items}}</p>
        <p style="color: #334155; font-size: 15px;"><strong>Total:</strong> {{cart_total}}</p>
      </div>
      <a href="{{cart_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Complete Your Purchase
      </a>
      <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
        Best,<br>{{creator_name}}
      </p>
    </div>`,
    variables: ['name', 'cart_items', 'cart_total', 'cart_url', 'creator_name', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tpl_recovery',
    type: 'RECOVERY',
    subject: 'Special discount just for you! 💝',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 16px; text-align: center;">Special Offer Just For You! 💝</h1>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 16px; text-align: center;">
        Hi {{name}},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
        We noticed you didn't complete your purchase. Here's a special discount to help you decide!
      </p>
      <div style="background: white; padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Exclusive Discount</p>
        <h2 style="color: #1e40af; font-size: 48px; font-weight: 800; margin-bottom: 8px;">{{discount}}% OFF</h2>
        <p style="color: #334155; font-size: 16px;">Use code: <strong>{{discount_code}}</strong></p>
      </div>
      <div style="text-align: center;">
        <a href="{{checkout_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px;">
          Claim Your Discount →
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; text-align: center;">
        Offer expires: {{expiry_date}}
      </p>
    </div>`,
    variables: ['name', 'discount', 'discount_code', 'checkout_url', 'expiry_date', 'creator_name', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tpl_newsletter',
    type: 'NEWSLETTER',
    subject: '{{creator_name}}\'s Weekly Update',
    body: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <h1 style="color: #1e40af; font-size: 24px; margin-bottom: 20px;">📰 Weekly Newsletter</h1>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
        <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">💡 This Week's Highlights</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Hi {{name}}, here's what's new this week!
        </p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 12px;">🎯 Featured Content</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Check out our latest products, courses, and updates.
        </p>
      </div>

      <a href="{{store_url}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Visit Store
      </a>

      <p style="color: #64748b; font-size: 14px; margin-top: 24px; text-align: center;">
        You're receiving this email because you subscribed to {{creator_name}}'s newsletter.
      </p>
    </div>`,
    variables: ['name', 'creator_name', 'store_url', 'unsubscribe_link'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// User customized templates (starts as copy of defaults)
export let mockEmailTemplates: MockEmailTemplate[] = [...defaultEmailTemplates]

// Email analytics summary
export const emailAnalytics = {
  totalSubscribers: 50,
  activeSubscribers: 45,
  totalCampaigns: 3,
  sentCampaigns: 2,
  avgOpenRate: 62.5, // percentage
  avgClickRate: 34.8, // percentage
  totalEmailsSent: 98,
  totalOpens: 60,
  totalClicks: 33,
  unsubscribeRate: 1.0, // percentage
  bestSendTime: 'Tuesday 10:00 AM',
  subscriberGrowth: [
    { date: '2024-01-01', count: 35 },
    { date: '2024-01-08', count: 38 },
    { date: '2024-01-15', count: 42 },
    { date: '2024-01-22', count: 45 },
    { date: '2024-01-29', count: 50 }
  ],
  openRateByDay: [
    { day: 'Monday', rate: 58 },
    { day: 'Tuesday', rate: 72 },
    { day: 'Wednesday', rate: 65 },
    { day: 'Thursday', rate: 61 },
    { day: 'Friday', rate: 55 },
    { day: 'Saturday', rate: 48 },
    { day: 'Sunday', rate: 42 }
  ],
  openRateByTime: [
    { time: '6-9 AM', rate: 45 },
    { time: '9-12 PM', rate: 68 },
    { time: '12-3 PM', rate: 62 },
    { time: '3-6 PM', rate: 55 },
    { time: '6-9 PM', rate: 48 },
    { time: '9-12 AM', rate: 32 }
  ]
}
