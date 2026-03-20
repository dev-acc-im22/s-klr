// Mock data for dashboard orders and analytics

export type OrderStatus = 'completed' | 'pending' | 'refunded';

export interface MockOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
}

export interface MockOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string | null;
  };
  items: MockOrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId: string;
  currency: string;
  createdAt: string;
}

export interface MockAnalyticsData {
  revenue: {
    total: number;
    previousPeriod: number;
    change: number;
    byDay: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
  };
  products: {
    totalSold: number;
    topProducts: Array<{
      id: string;
      title: string;
      sales: number;
      revenue: number;
      category: string;
    }>;
  };
  visitors: {
    total: number;
    unique: number;
    byDay: Array<{
      date: string;
      visitors: number;
      pageViews: number;
    }>;
  };
  conversion: {
    rate: number;
    previousRate: number;
    change: number;
  };
  geography: Array<{
    country: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

// Generate realistic mock orders (20 orders)
export const mockOrders: MockOrder[] = [
  {
    id: "ORD-2024-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: null,
    },
    items: [
      { id: "item-1", productId: "prod-1", productTitle: "Content Creator Starter Kit", price: 29, quantity: 1 },
    ],
    total: 29.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzABC123def456",
    currency: "USD",
    createdAt: "2024-01-15T09:23:45Z",
  },
  {
    id: "ORD-2024-002",
    customer: {
      name: "Michael Chen",
      email: "mike.chen@gmail.com",
      avatar: null,
    },
    items: [
      { id: "item-2", productId: "course-1", productTitle: "Build Your Creator Business", price: 199, quantity: 1 },
    ],
    total: 199.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzDEF789ghi012",
    currency: "USD",
    createdAt: "2024-01-15T11:45:30Z",
  },
  {
    id: "ORD-2024-003",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@outlook.com",
      avatar: null,
    },
    items: [
      { id: "item-3", productId: "prod-2", productTitle: "Social Media Strategy Guide", price: 49, quantity: 1 },
      { id: "item-4", productId: "prod-3", productTitle: "Email Marketing Templates", price: 19, quantity: 1 },
    ],
    total: 68.00,
    status: "completed",
    paymentMethod: "paypal",
    paymentId: "PAYID-ABC123DEF456",
    currency: "USD",
    createdAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "ORD-2024-004",
    customer: {
      name: "Alex Thompson",
      email: "alex.t@company.co",
      avatar: null,
    },
    items: [
      { id: "item-5", productId: "course-2", productTitle: "Instagram Growth Masterclass", price: 79, quantity: 1 },
    ],
    total: 79.00,
    status: "pending",
    paymentMethod: "card",
    paymentId: "pi_3OxYzPENDING001",
    currency: "USD",
    createdAt: "2024-01-14T16:20:15Z",
  },
  {
    id: "ORD-2024-005",
    customer: {
      name: "Jordan Lee",
      email: "jordan.lee@me.com",
      avatar: null,
    },
    items: [
      { id: "item-6", productId: "prod-4", productTitle: "Thumbnail Design Pack", price: 15, quantity: 2 },
    ],
    total: 30.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzGHI345jkl678",
    currency: "USD",
    createdAt: "2024-01-13T10:15:00Z",
  },
  {
    id: "ORD-2024-006",
    customer: {
      name: "Rachel Kim",
      email: "rachel.kim@gmail.com",
      avatar: null,
    },
    items: [
      { id: "item-7", productId: "prod-1", productTitle: "Content Creator Starter Kit", price: 29, quantity: 1 },
      { id: "item-8", productId: "prod-2", productTitle: "Social Media Strategy Guide", price: 49, quantity: 1 },
    ],
    total: 78.00,
    status: "completed",
    paymentMethod: "applepay",
    paymentId: "APPLEPAY-XYZ789",
    currency: "USD",
    createdAt: "2024-01-13T13:45:30Z",
  },
  {
    id: "ORD-2024-007",
    customer: {
      name: "David Wilson",
      email: "david.wilson@yahoo.com",
      avatar: null,
    },
    items: [
      { id: "item-9", productId: "course-1", productTitle: "Build Your Creator Business", price: 199, quantity: 1 },
    ],
    total: 199.00,
    status: "refunded",
    paymentMethod: "card",
    paymentId: "pi_3OxYzREFUND001",
    currency: "USD",
    createdAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "ORD-2024-008",
    customer: {
      name: "Lisa Martinez",
      email: "lisa.martinez@icloud.com",
      avatar: null,
    },
    items: [
      { id: "item-10", productId: "prod-3", productTitle: "Email Marketing Templates", price: 19, quantity: 1 },
    ],
    total: 19.00,
    status: "completed",
    paymentMethod: "paypal",
    paymentId: "PAYID-JKL012MNO345",
    currency: "USD",
    createdAt: "2024-01-12T15:30:45Z",
  },
  {
    id: "ORD-2024-009",
    customer: {
      name: "James Brown",
      email: "j.brown@proton.me",
      avatar: null,
    },
    items: [
      { id: "item-11", productId: "course-2", productTitle: "Instagram Growth Masterclass", price: 79, quantity: 1 },
      { id: "item-12", productId: "prod-4", productTitle: "Thumbnail Design Pack", price: 15, quantity: 1 },
    ],
    total: 94.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzPQR678stu901",
    currency: "USD",
    createdAt: "2024-01-11T11:20:00Z",
  },
  {
    id: "ORD-2024-010",
    customer: {
      name: "Amanda White",
      email: "amanda.w@hotmail.com",
      avatar: null,
    },
    items: [
      { id: "item-13", productId: "prod-2", productTitle: "Social Media Strategy Guide", price: 49, quantity: 1 },
    ],
    total: 49.00,
    status: "pending",
    paymentMethod: "card",
    paymentId: "pi_3OxYzPENDING002",
    currency: "USD",
    createdAt: "2024-01-11T17:55:30Z",
  },
  {
    id: "ORD-2024-011",
    customer: {
      name: "Chris Taylor",
      email: "chris.t@gmail.com",
      avatar: null,
    },
    items: [
      { id: "item-14", productId: "prod-1", productTitle: "Content Creator Starter Kit", price: 29, quantity: 1 },
    ],
    total: 29.00,
    status: "completed",
    paymentMethod: "googlepay",
    paymentId: "GOOGLEPAY-ABC123",
    currency: "USD",
    createdAt: "2024-01-10T08:45:00Z",
  },
  {
    id: "ORD-2024-012",
    customer: {
      name: "Nicole Garcia",
      email: "nicole.g@studio.com",
      avatar: null,
    },
    items: [
      { id: "item-15", productId: "course-1", productTitle: "Build Your Creator Business", price: 199, quantity: 1 },
    ],
    total: 199.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzVWX234yza567",
    currency: "USD",
    createdAt: "2024-01-10T12:10:15Z",
  },
  {
    id: "ORD-2024-013",
    customer: {
      name: "Kevin Anderson",
      email: "kevin.a@fastmail.com",
      avatar: null,
    },
    items: [
      { id: "item-16", productId: "prod-4", productTitle: "Thumbnail Design Pack", price: 15, quantity: 3 },
    ],
    total: 45.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzBCD890efg123",
    currency: "USD",
    createdAt: "2024-01-09T14:30:00Z",
  },
  {
    id: "ORD-2024-014",
    customer: {
      name: "Megan Robinson",
      email: "megan.r@hey.com",
      avatar: null,
    },
    items: [
      { id: "item-17", productId: "prod-3", productTitle: "Email Marketing Templates", price: 19, quantity: 1 },
      { id: "item-18", productId: "prod-1", productTitle: "Content Creator Starter Kit", price: 29, quantity: 1 },
    ],
    total: 48.00,
    status: "refunded",
    paymentMethod: "paypal",
    paymentId: "PAYID-REFUND002",
    currency: "USD",
    createdAt: "2024-01-09T16:45:30Z",
  },
  {
    id: "ORD-2024-015",
    customer: {
      name: "Brandon Scott",
      email: "brandon.s@live.com",
      avatar: null,
    },
    items: [
      { id: "item-19", productId: "course-2", productTitle: "Instagram Growth Masterclass", price: 79, quantity: 1 },
    ],
    total: 79.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzHIJ456klm789",
    currency: "USD",
    createdAt: "2024-01-08T09:20:45Z",
  },
  {
    id: "ORD-2024-016",
    customer: {
      name: "Jennifer Moore",
      email: "jennifer.m@gmail.com",
      avatar: null,
    },
    items: [
      { id: "item-20", productId: "prod-2", productTitle: "Social Media Strategy Guide", price: 49, quantity: 1 },
      { id: "item-21", productId: "prod-4", productTitle: "Thumbnail Design Pack", price: 15, quantity: 1 },
    ],
    total: 64.00,
    status: "completed",
    paymentMethod: "applepay",
    paymentId: "APPLEPAY-DEF456",
    currency: "USD",
    createdAt: "2024-01-08T13:15:00Z",
  },
  {
    id: "ORD-2024-017",
    customer: {
      name: "Tyler Jackson",
      email: "tyler.j@outlook.com",
      avatar: null,
    },
    items: [
      { id: "item-22", productId: "course-1", productTitle: "Build Your Creator Business", price: 199, quantity: 1 },
    ],
    total: 199.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzNOP012qrs345",
    currency: "USD",
    createdAt: "2024-01-07T10:50:30Z",
  },
  {
    id: "ORD-2024-018",
    customer: {
      name: "Stephanie Clark",
      email: "steph.clark@proton.me",
      avatar: null,
    },
    items: [
      { id: "item-23", productId: "prod-1", productTitle: "Content Creator Starter Kit", price: 29, quantity: 1 },
    ],
    total: 29.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzTUV678wxy901",
    currency: "USD",
    createdAt: "2024-01-07T15:30:00Z",
  },
  {
    id: "ORD-2024-019",
    customer: {
      name: "Ryan Lewis",
      email: "ryan.l@company.co",
      avatar: null,
    },
    items: [
      { id: "item-24", productId: "prod-3", productTitle: "Email Marketing Templates", price: 19, quantity: 2 },
    ],
    total: 38.00,
    status: "pending",
    paymentMethod: "paypal",
    paymentId: "PAYID-PENDING003",
    currency: "USD",
    createdAt: "2024-01-06T11:40:15Z",
  },
  {
    id: "ORD-2024-020",
    customer: {
      name: "Ashley Walker",
      email: "ashley.w@me.com",
      avatar: null,
    },
    items: [
      { id: "item-25", productId: "course-2", productTitle: "Instagram Growth Masterclass", price: 79, quantity: 1 },
      { id: "item-26", productId: "prod-2", productTitle: "Social Media Strategy Guide", price: 49, quantity: 1 },
    ],
    total: 128.00,
    status: "completed",
    paymentMethod: "card",
    paymentId: "pi_3OxYzZAB234cde567",
    currency: "USD",
    createdAt: "2024-01-06T17:25:00Z",
  },
];

// Generate mock analytics data
export function getMockAnalyticsData(timeRange: string): MockAnalyticsData {
  // Generate different data based on time range
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  
  const revenueByDay = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (Math.min(days, 30) - 1 - i));
    const revenue = Math.floor(Math.random() * 800) + 200;
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue,
      orders: Math.floor(revenue / 35),
    };
  });

  const visitorsByDay = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (Math.min(days, 30) - 1 - i));
    const visitors = Math.floor(Math.random() * 500) + 100;
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors,
      pageViews: visitors * Math.floor(Math.random() * 3) + 2,
    };
  });

  const multiplier = days === 7 ? 1 : days === 30 ? 4 : days === 90 ? 12 : 48;

  return {
    revenue: {
      total: 12628 * multiplier / 4,
      previousPeriod: 10500 * multiplier / 4,
      change: 20.3,
      byDay: revenueByDay,
    },
    products: {
      totalSold: 284 * multiplier / 4,
      topProducts: [
        { id: 'prod-4', title: 'Thumbnail Design Pack', sales: 892, revenue: 13380, category: 'Templates' },
        { id: 'prod-3', title: 'Email Marketing Templates', sales: 756, revenue: 14364, category: 'Templates' },
        { id: 'prod-1', title: 'Content Creator Starter Kit', sales: 634, revenue: 18386, category: 'Templates' },
        { id: 'course-1', title: 'Build Your Creator Business', sales: 234, revenue: 46566, category: 'Course' },
        { id: 'course-2', title: 'Instagram Growth Masterclass', sales: 412, revenue: 32548, category: 'Course' },
        { id: 'prod-2', title: 'Social Media Strategy Guide', sales: 521, revenue: 25529, category: 'E-book' },
      ],
    },
    visitors: {
      total: 12543 * multiplier / 4,
      unique: 8921 * multiplier / 4,
      byDay: visitorsByDay,
    },
    conversion: {
      rate: 2.8,
      previousRate: 2.1,
      change: 33.3,
    },
    geography: [
      { country: 'United States', orders: 145, revenue: 8234, percentage: 42 },
      { country: 'United Kingdom', orders: 52, revenue: 2890, percentage: 15 },
      { country: 'Canada', orders: 38, revenue: 2156, percentage: 11 },
      { country: 'Australia', orders: 29, revenue: 1567, percentage: 8 },
      { country: 'Germany', orders: 21, revenue: 1234, percentage: 6 },
      { country: 'Other', orders: 61, revenue: 3547, percentage: 18 },
    ],
    trafficSources: [
      { source: 'Direct', visitors: 4523, percentage: 36 },
      { source: 'Instagram', visitors: 2890, percentage: 23 },
      { source: 'YouTube', visitors: 2156, percentage: 17 },
      { source: 'Twitter', visitors: 1234, percentage: 10 },
      { source: 'Google Search', visitors: 987, percentage: 8 },
      { source: 'Other', visitors: 753, percentage: 6 },
    ],
  };
}

// Helper functions for orders
export function getMockOrders(status?: string, search?: string): MockOrder[] {
  let filtered = [...mockOrders];
  
  if (status && status !== 'all') {
    filtered = filtered.filter(order => order.status === status);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(order => 
      order.customer.email.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getMockOrderById(id: string): MockOrder | null {
  return mockOrders.find(order => order.id === id) || null;
}

// Format date for display
export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
