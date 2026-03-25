export interface MockCartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: Date;
  product: {
    id: string;
    title: string;
    price: number;
    images: string;
  };
}

export interface MockCart {
  id: string;
  sessionId: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: MockCartItem[];
}

export interface MockRecoveryEmail {
  id: string;
  sentAt: Date;
  openedAt: Date | null;
  clickedAt: Date | null;
}

export interface MockAbandonedCart {
  id: string;
  cartId: string;
  email: string;
  recoveryEmailSentAt: Date | null;
  recoveredAt: Date | null;
  status: 'pending' | 'email_sent' | 'recovered' | 'expired';
  discountCode: string | null;
  createdAt: Date;
  cart: MockCart;
  recoveryEmails: MockRecoveryEmail[];
  cartTotal?: number;
}

export interface MockRecoveryStats {
  totalAbandoned: number;
  emailsSent: number;
  recovered: number;
  recoveryRate: number;
  potentialRevenue: number;
  recoveredRevenue: number;
}

export const mockCarts: MockCart[] = [
  {
    id: 'cart-1',
    sessionId: 'session-abc123',
    email: 'john.doe@example.com',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 1,
        addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        product: {
          id: 'prod-1',
          title: 'Creator Starter Kit',
          price: 29,
          images: '/images/product-1.jpg',
        },
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        quantity: 2,
        addedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        product: {
          id: 'prod-2',
          title: 'Content Strategy Guide',
          price: 49,
          images: '/images/product-2.jpg',
        },
      },
    ],
  },
];

export const mockAbandonedCarts: MockAbandonedCart[] = [
  {
    id: 'abandoned-1',
    cartId: 'cart-1',
    email: 'john.doe@example.com',
    recoveryEmailSentAt: null,
    recoveredAt: null,
    status: 'pending',
    discountCode: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    cart: {
      id: 'cart-1',
      sessionId: 'session-abc123',
      email: 'john.doe@example.com',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          quantity: 1,
          addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          product: {
            id: 'prod-1',
            title: 'Creator Starter Kit',
            price: 29,
            images: '/images/product-1.jpg',
          },
        },
        {
          id: 'item-2',
          productId: 'prod-2',
          quantity: 2,
          addedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          product: {
            id: 'prod-2',
            title: 'Content Strategy Guide',
            price: 49,
            images: '/images/product-2.jpg',
          },
        },
      ],
    },
    recoveryEmails: [],
    cartTotal: 127,
  },
  {
    id: 'abandoned-2',
    cartId: 'cart-2',
    email: 'sarah.smith@gmail.com',
    recoveryEmailSentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    recoveredAt: null,
    status: 'email_sent',
    discountCode: 'COMEBACK10',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    cart: {
      id: 'cart-2',
      sessionId: 'session-def456',
      email: 'sarah.smith@gmail.com',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-3',
          productId: 'prod-3',
          quantity: 1,
          addedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          product: {
            id: 'prod-3',
            title: 'Email Templates Pack',
            price: 19,
            images: '/images/product-3.jpg',
          },
        },
      ],
    },
    recoveryEmails: [
      {
        id: 'email-1',
        sentAt: new Date(Date.now() - 30 * 60 * 1000),
        openedAt: new Date(Date.now() - 15 * 60 * 1000),
        clickedAt: null,
      },
    ],
    cartTotal: 19,
  },
  {
    id: 'abandoned-3',
    cartId: 'cart-3',
    email: 'mike.wilson@yahoo.com',
    recoveryEmailSentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    recoveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'recovered',
    discountCode: 'WELCOME15',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    cart: {
      id: 'cart-3',
      sessionId: 'session-ghi789',
      email: 'mike.wilson@yahoo.com',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-4',
          productId: 'prod-4',
          quantity: 1,
          addedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          product: {
            id: 'prod-4',
            title: 'Thumbnail Design Pack',
            price: 15,
            images: '/images/product-4.jpg',
          },
        },
        {
          id: 'item-5',
          productId: 'prod-5',
          quantity: 2,
          addedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
          product: {
            id: 'prod-5',
            title: 'Social Media Presets',
            price: 25,
            images: '/images/product-5.jpg',
          },
        },
      ],
    },
    recoveryEmails: [
      {
        id: 'email-2',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        openedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        clickedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
    ],
    cartTotal: 65,
  },
  {
    id: 'abandoned-4',
    cartId: 'cart-4',
    email: 'emma.johnson@outlook.com',
    recoveryEmailSentAt: null,
    recoveredAt: null,
    status: 'pending',
    discountCode: null,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    cart: {
      id: 'cart-4',
      sessionId: 'session-jkl012',
      email: 'emma.johnson@outlook.com',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000),
      items: [
        {
          id: 'item-6',
          productId: 'prod-1',
          quantity: 3,
          addedAt: new Date(Date.now() - 45 * 60 * 1000),
          product: {
            id: 'prod-1',
            title: 'Creator Starter Kit',
            price: 29,
            images: '/images/product-1.jpg',
          },
        },
      ],
    },
    recoveryEmails: [],
    cartTotal: 87,
  },
  {
    id: 'abandoned-5',
    cartId: 'cart-5',
    email: 'david.brown@hotmail.com',
    recoveryEmailSentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    recoveredAt: null,
    status: 'email_sent',
    discountCode: 'RETURNSAVE20',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    cart: {
      id: 'cart-5',
      sessionId: 'session-mno345',
      email: 'david.brown@hotmail.com',
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-7',
          productId: 'prod-2',
          quantity: 1,
          addedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
          product: {
            id: 'prod-2',
            title: 'Content Strategy Guide',
            price: 49,
            images: '/images/product-2.jpg',
          },
        },
        {
          id: 'item-8',
          productId: 'prod-3',
          quantity: 1,
          addedAt: new Date(Date.now() - 25.5 * 60 * 60 * 1000),
          product: {
            id: 'prod-3',
            title: 'Email Templates Pack',
            price: 19,
            images: '/images/product-3.jpg',
          },
        },
      ],
    },
    recoveryEmails: [
      {
        id: 'email-3',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        openedAt: null,
        clickedAt: null,
      },
    ],
    cartTotal: 68,
  },
  {
    id: 'abandoned-6',
    cartId: 'cart-6',
    email: 'lisa.chen@gmail.com',
    recoveryEmailSentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    recoveredAt: null,
    status: 'expired',
    discountCode: 'LASTCHANCE25',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    cart: {
      id: 'cart-6',
      sessionId: 'session-pqr678',
      email: 'lisa.chen@gmail.com',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-9',
          productId: 'prod-5',
          quantity: 1,
          addedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          product: {
            id: 'prod-5',
            title: 'Social Media Presets',
            price: 25,
            images: '/images/product-5.jpg',
          },
        },
      ],
    },
    recoveryEmails: [
      {
        id: 'email-4',
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        openedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
        clickedAt: null,
      },
    ],
    cartTotal: 25,
  },
  {
    id: 'abandoned-7',
    cartId: 'cart-7',
    email: 'alex.martinez@icloud.com',
    recoveryEmailSentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    recoveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'recovered',
    discountCode: 'BACKTOSAVE15',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    cart: {
      id: 'cart-7',
      sessionId: 'session-stu901',
      email: 'alex.martinez@icloud.com',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      items: [
        {
          id: 'item-10',
          productId: 'prod-4',
          quantity: 2,
          addedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          product: {
            id: 'prod-4',
            title: 'Thumbnail Design Pack',
            price: 15,
            images: '/images/product-4.jpg',
          },
        },
      ],
    },
    recoveryEmails: [
      {
        id: 'email-5',
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        openedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        clickedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      },
    ],
    cartTotal: 30,
  },
  {
    id: 'abandoned-8',
    cartId: 'cart-8',
    email: 'rachel.green@proton.me',
    recoveryEmailSentAt: null,
    recoveredAt: null,
    status: 'pending',
    discountCode: null,
    createdAt: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    cart: {
      id: 'cart-8',
      sessionId: 'session-vwx234',
      email: 'rachel.green@proton.me',
      createdAt: new Date(Date.now() - 90 * 60 * 1000),
      updatedAt: new Date(Date.now() - 90 * 60 * 1000),
      items: [
        {
          id: 'item-11',
          productId: 'prod-1',
          quantity: 1,
          addedAt: new Date(Date.now() - 90 * 60 * 1000),
          product: {
            id: 'prod-1',
            title: 'Creator Starter Kit',
            price: 29,
            images: '/images/product-1.jpg',
          },
        },
        {
          id: 'item-12',
          productId: 'prod-4',
          quantity: 1,
          addedAt: new Date(Date.now() - 80 * 60 * 1000),
          product: {
            id: 'prod-4',
            title: 'Thumbnail Design Pack',
            price: 15,
            images: '/images/product-4.jpg',
          },
        },
        {
          id: 'item-13',
          productId: 'prod-5',
          quantity: 1,
          addedAt: new Date(Date.now() - 70 * 60 * 1000),
          product: {
            id: 'prod-5',
            title: 'Social Media Presets',
            price: 25,
            images: '/images/product-5.jpg',
          },
        },
      ],
    },
    recoveryEmails: [],
    cartTotal: 69,
  },
];

export const mockRecoveryStats: MockRecoveryStats = {
  totalAbandoned: 8,
  emailsSent: 5,
  recovered: 2,
  recoveryRate: 25,
  potentialRevenue: 490,
  recoveredRevenue: 95,
};

export const mockRecoverySettings = {
  enabled: true,
  abandonmentThreshold: 60, // minutes
  firstEmailDelay: 60, // minutes
  secondEmailDelay: 1440, // minutes (24 hours)
  thirdEmailDelay: 4320, // minutes (72 hours)
  defaultDiscountPercent: 10,
  emailTemplate: {
    subject: 'You left something behind!',
    body: `Hi there!

We noticed you left some items in your cart. Don't worry, we saved them for you!

Complete your purchase now and get {discount}% off with code: {code}

{cart_items}

This offer expires in 24 hours.

Best,
The CreatorHub Team`,
  },
};
