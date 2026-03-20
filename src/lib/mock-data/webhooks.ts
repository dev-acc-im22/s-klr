// Mock data for webhooks

export interface Webhook {
  id: string
  url: string
  secret: string
  events: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface WebhookLog {
  id: string
  webhookId: string
  event: string
  payload: string
  response: string | null
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING'
  attempts: number
  error: string | null
  createdAt: Date
}

// Available webhook events
export const webhookEvents = [
  { id: 'order.created', name: 'Order Created', description: 'When a new order is placed' },
  { id: 'order.refunded', name: 'Order Refunded', description: 'When an order is refunded' },
  { id: 'order.cancelled', name: 'Order Cancelled', description: 'When an order is cancelled' },
  { id: 'enrollment.created', name: 'Enrollment Created', description: 'When a student enrolls in a course' },
  { id: 'enrollment.completed', name: 'Enrollment Completed', description: 'When a student completes a course' },
  { id: 'course.completed', name: 'Course Completed', description: 'When a course is fully completed' },
  { id: 'subscriber.added', name: 'Subscriber Added', description: 'When a new email subscriber is added' },
  { id: 'subscriber.removed', name: 'Subscriber Removed', description: 'When an email subscriber unsubscribes' },
  { id: 'booking.created', name: 'Booking Created', description: 'When a new booking is made' },
  { id: 'booking.cancelled', name: 'Booking Cancelled', description: 'When a booking is cancelled' },
  { id: 'review.created', name: 'Review Created', description: 'When a new review is submitted' },
  { id: 'affiliate.sale', name: 'Affiliate Sale', description: 'When an affiliate generates a sale' },
] as const

export type WebhookEventType = typeof webhookEvents[number]['id']

// Generate a random secret key
export function generateSecretKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'whsec_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Mock webhooks data
export const mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    url: 'https://example.com/webhooks/orders',
    secret: 'whsec_abc123def456ghi789jkl012mno345pqr',
    events: ['order.created', 'order.refunded'],
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    userId: 'user-1',
  },
  {
    id: 'webhook-2',
    url: 'https://api.zapier.com/hooks/abc123',
    secret: 'whsec_xyz789uvw456rst123opq567lmn890ijk',
    events: ['enrollment.created', 'course.completed'],
    isActive: true,
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-22T09:15:00Z'),
    userId: 'user-1',
  },
  {
    id: 'webhook-3',
    url: 'https://webhook.site/unique-id',
    secret: 'whsec_test123test456test789test012test',
    events: ['subscriber.added', 'booking.created'],
    isActive: false,
    createdAt: new Date('2024-02-01T08:00:00Z'),
    updatedAt: new Date('2024-02-01T08:00:00Z'),
    userId: 'user-1',
  },
]

// Mock webhook logs
export const mockWebhookLogs: WebhookLog[] = [
  {
    id: 'log-1',
    webhookId: 'webhook-1',
    event: 'order.created',
    payload: JSON.stringify({
      id: 'order-123',
      total: 99.99,
      currency: 'USD',
      buyer: { email: 'buyer@example.com', name: 'John Doe' },
      items: [{ productId: 'prod-1', title: 'Digital Product', price: 99.99 }],
      createdAt: new Date().toISOString(),
    }),
    response: JSON.stringify({ received: true }),
    status: 'SUCCESS',
    attempts: 1,
    error: null,
    createdAt: new Date('2024-01-16T09:30:00Z'),
  },
  {
    id: 'log-2',
    webhookId: 'webhook-1',
    event: 'order.refunded',
    payload: JSON.stringify({
      id: 'order-456',
      refundAmount: 49.99,
      reason: 'Customer request',
      refundedAt: new Date().toISOString(),
    }),
    response: null,
    status: 'FAILED',
    attempts: 3,
    error: 'Connection timeout after 30 seconds',
    createdAt: new Date('2024-01-17T14:20:00Z'),
  },
  {
    id: 'log-3',
    webhookId: 'webhook-2',
    event: 'enrollment.created',
    payload: JSON.stringify({
      id: 'enrollment-789',
      courseId: 'course-1',
      courseName: 'Mastering React',
      student: { email: 'student@example.com', name: 'Jane Smith' },
      enrolledAt: new Date().toISOString(),
    }),
    response: JSON.stringify({ status: 'processed' }),
    status: 'SUCCESS',
    attempts: 1,
    error: null,
    createdAt: new Date('2024-01-21T11:45:00Z'),
  },
  {
    id: 'log-4',
    webhookId: 'webhook-2',
    event: 'course.completed',
    payload: JSON.stringify({
      enrollmentId: 'enrollment-789',
      courseId: 'course-1',
      courseName: 'Mastering React',
      student: { email: 'student@example.com', name: 'Jane Smith' },
      completedAt: new Date().toISOString(),
      certificateIssued: true,
    }),
    response: null,
    status: 'RETRYING',
    attempts: 2,
    error: 'Server returned 503 Service Unavailable',
    createdAt: new Date('2024-01-22T16:00:00Z'),
  },
  {
    id: 'log-5',
    webhookId: 'webhook-1',
    event: 'order.created',
    payload: JSON.stringify({
      id: 'order-789',
      total: 149.99,
      currency: 'USD',
      buyer: { email: 'newbuyer@example.com', name: 'Bob Wilson' },
      items: [{ productId: 'prod-2', title: 'Premium Course', price: 149.99 }],
      createdAt: new Date().toISOString(),
    }),
    response: JSON.stringify({ received: true, orderId: 'external-123' }),
    status: 'SUCCESS',
    attempts: 1,
    error: null,
    createdAt: new Date('2024-01-23T10:15:00Z'),
  },
]

// Webhook statistics
export const mockWebhookStats = {
  totalWebhooks: 3,
  activeWebhooks: 2,
  totalDeliveries: 156,
  successfulDeliveries: 142,
  failedDeliveries: 14,
  successRate: 91.03,
}
