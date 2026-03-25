export interface Order {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  total: number;
  currency: string;
  paymentMethod: string;
  paymentId: string;
  createdAt: Date;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    productTitle: string;
    price: number;
    quantity: number;
  }[];
}

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    status: 'COMPLETED',
    total: 78,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: 'pi_3abc123',
    createdAt: new Date('2024-03-15T10:30:00'),
    buyer: {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
    },
    items: [
      { id: 'item-1', productTitle: 'Creator Starter Kit', price: 29, quantity: 1 },
      { id: 'item-2', productTitle: 'Content Strategy Guide', price: 49, quantity: 1 },
    ],
  },
  {
    id: 'ord-002',
    status: 'COMPLETED',
    total: 29,
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentId: 'PAYID-123',
    createdAt: new Date('2024-03-14T15:45:00'),
    buyer: {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael@example.com',
    },
    items: [
      { id: 'item-3', productTitle: 'Creator Starter Kit', price: 29, quantity: 1 },
    ],
  },
  {
    id: 'ord-003',
    status: 'PENDING',
    total: 199,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: '',
    createdAt: new Date('2024-03-14T09:20:00'),
    buyer: {
      id: 'user-3',
      name: 'Emily Davis',
      email: 'emily@example.com',
    },
    items: [
      { id: 'item-4', productTitle: 'Creator Business Masterclass', price: 199, quantity: 1 },
    ],
  },
  {
    id: 'ord-004',
    status: 'COMPLETED',
    total: 44,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: 'pi_3def456',
    createdAt: new Date('2024-03-13T14:10:00'),
    buyer: {
      id: 'user-4',
      name: 'David Wilson',
      email: 'david@example.com',
    },
    items: [
      { id: 'item-5', productTitle: 'Email Templates Pack', price: 19, quantity: 2 },
    ],
  },
  {
    id: 'ord-005',
    status: 'REFUNDED',
    total: 49,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: 'pi_3ghi789',
    createdAt: new Date('2024-03-12T11:30:00'),
    buyer: {
      id: 'user-5',
      name: 'Jessica Brown',
      email: 'jessica@example.com',
    },
    items: [
      { id: 'item-6', productTitle: 'Content Strategy Guide', price: 49, quantity: 1 },
    ],
  },
  {
    id: 'ord-006',
    status: 'COMPLETED',
    total: 79,
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentId: 'PAYID-456',
    createdAt: new Date('2024-03-11T16:55:00'),
    buyer: {
      id: 'user-6',
      name: 'Alex Thompson',
      email: 'alex@example.com',
    },
    items: [
      { id: 'item-7', productTitle: 'Instagram Growth Masterclass', price: 79, quantity: 1 },
    ],
  },
  {
    id: 'ord-007',
    status: 'COMPLETED',
    total: 15,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: 'pi_3jkl012',
    createdAt: new Date('2024-03-10T08:15:00'),
    buyer: {
      id: 'user-7',
      name: 'Ryan Martinez',
      email: 'ryan@example.com',
    },
    items: [
      { id: 'item-8', productTitle: 'Thumbnail Design Pack', price: 15, quantity: 1 },
    ],
  },
  {
    id: 'ord-008',
    status: 'COMPLETED',
    total: 248,
    currency: 'USD',
    paymentMethod: 'Stripe',
    paymentId: 'pi_3mno345',
    createdAt: new Date('2024-03-09T13:40:00'),
    buyer: {
      id: 'user-8',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
    },
    items: [
      { id: 'item-9', productTitle: 'Creator Business Masterclass', price: 199, quantity: 1 },
      { id: 'item-10', productTitle: 'Creator Starter Kit', price: 29, quantity: 1 },
      { id: 'item-11', productTitle: 'Email Templates Pack', price: 19, quantity: 1 },
    ],
  },
];

export const mockAnalytics = {
  overview: {
    totalRevenue: 15420,
    totalOrders: 187,
    totalCustomers: 142,
    averageOrderValue: 82.46,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
  },
  revenue: [
    { date: 'Mar 9', revenue: 248 },
    { date: 'Mar 10', revenue: 15 },
    { date: 'Mar 11', revenue: 79 },
    { date: 'Mar 12', revenue: 0 },
    { date: 'Mar 13', revenue: 44 },
    { date: 'Mar 14', revenue: 228 },
    { date: 'Mar 15', revenue: 78 },
  ],
  topProducts: [
    { title: 'Creator Starter Kit', sales: 89, revenue: 2581 },
    { title: 'Content Strategy Guide', sales: 67, revenue: 3283 },
    { title: 'Email Templates Pack', sales: 134, revenue: 2546 },
    { title: 'Thumbnail Design Pack', sales: 98, revenue: 1470 },
    { title: 'Creator Business Masterclass', sales: 23, revenue: 4577 },
  ],
  visitors: [
    { date: 'Mar 9', visitors: 234 },
    { date: 'Mar 10', visitors: 189 },
    { date: 'Mar 11', visitors: 312 },
    { date: 'Mar 12', visitors: 178 },
    { date: 'Mar 13', visitors: 245 },
    { date: 'Mar 14', visitors: 289 },
    { date: 'Mar 15', visitors: 356 },
  ],
};

// Geographic breakdown data
export const mockGeographicData = [
  { country: '🇺🇸 United States', code: 'US', orders: 89, revenue: 4520, percentage: 35 },
  { country: '🇬🇧 United Kingdom', code: 'GB', orders: 34, revenue: 2134, percentage: 18 },
  { country: '🇨🇦 Canada', code: 'CA', orders: 28, revenue: 1890, percentage: 12 },
  { country: '🇦🇺 Australia', code: 'AU', orders: 21, revenue: 1456, percentage: 9 },
  { country: '🇩🇪 Germany', code: 'DE', orders: 15, revenue: 987, percentage: 6 },
  { country: '🇫🇷 France', code: 'FR', orders: 12, revenue: 756, percentage: 5 },
  { country: '🇯🇵 Japan', code: 'JP', orders: 10, revenue: 645, percentage: 4 },
  { country: '🇧🇷 Brazil', code: 'BR', orders: 8, revenue: 523, percentage: 3 },
];

// Traffic sources data
export const mockTrafficSources = [
  { source: 'Direct', visitors: 4523, percentage: 32 },
  { source: 'Instagram', visitors: 2891, percentage: 21 },
  { source: 'Google Search', visitors: 2156, percentage: 15 },
  { source: 'YouTube', visitors: 1678, percentage: 12 },
  { source: 'Twitter', visitors: 1234, percentage: 9 },
  { source: 'TikTok', visitors: 987, percentage: 7 },
  { source: 'Email', visitors: 456, percentage: 3 },
  { source: 'Referral', visitors: 189, percentage: 1 },
];

// Device breakdown data
export const mockDeviceBreakdown = [
  { device: 'Mobile', visitors: 8567, percentage: 62 },
  { device: 'Desktop', visitors: 4234, percentage: 31 },
  { device: 'Tablet', visitors: 913, percentage: 7 },
];

// Top pages data
export const mockTopPages = [
  { path: '/', title: 'Home', views: 4523, uniqueVisitors: 3891 },
  { path: '/products/starter-kit', title: 'Creator Starter Kit', views: 2156, uniqueVisitors: 1876 },
  { path: '/courses/masterclass', title: 'Business Masterclass', views: 1876, uniqueVisitors: 1523 },
  { path: '/products/content-guide', title: 'Content Strategy Guide', views: 1534, uniqueVisitors: 1234 },
  { path: '/coaching', title: '1:1 Coaching', views: 1234, uniqueVisitors: 987 },
  { path: '/products/email-templates', title: 'Email Templates Pack', views: 987, uniqueVisitors: 765 },
  { path: '/community', title: 'Community', views: 876, uniqueVisitors: 654 },
  { path: '/products/thumbnails', title: 'Thumbnail Design Pack', views: 654, uniqueVisitors: 543 },
];

// Revenue by product data
export const mockRevenueByProduct = [
  { id: 'prod-1', title: 'Creator Business Masterclass', revenue: 4577, sales: 23, growth: 15.3, type: 'course' as const },
  { id: 'prod-2', title: 'Content Strategy Guide', revenue: 3283, sales: 67, growth: 8.7, type: 'digital' as const },
  { id: 'prod-3', title: 'Creator Starter Kit', revenue: 2581, sales: 89, growth: 12.1, type: 'digital' as const },
  { id: 'prod-4', title: 'Email Templates Pack', revenue: 2546, sales: 134, growth: -2.3, type: 'digital' as const },
  { id: 'prod-5', title: '1:1 Strategy Coaching', revenue: 1890, sales: 12, growth: 45.6, type: 'coaching' as const },
  { id: 'prod-6', title: 'Thumbnail Design Pack', revenue: 1470, sales: 98, growth: 5.4, type: 'digital' as const },
];

// Conversion funnel data
export const mockConversionFunnel = [
  { id: 'visitors', name: 'Visitors', count: 13714, percentage: 100, dropoff: 0 },
  { id: 'views', name: 'Product Views', count: 8567, percentage: 62.5, dropoff: 37.5 },
  { id: 'cart', name: 'Added to Cart', count: 2341, percentage: 17.1, dropoff: 72.7 },
  { id: 'purchases', name: 'Purchases', count: 187, percentage: 1.4, dropoff: 92.0 },
];
