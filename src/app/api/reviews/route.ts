import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Mock reviews for ghost mode
const mockReviews = [
  {
    id: 'review-1',
    userId: 'user-1',
    productId: 'product-1',
    courseId: null,
    rating: 5,
    title: 'Excellent product!',
    content: 'This exceeded my expectations. The quality is amazing and the content is very well organized. Highly recommend to anyone looking to learn.',
    isVerified: true,
    isApproved: true,
    helpful: 24,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    user: {
      id: 'user-1',
      name: 'Sarah Johnson',
      image: '/avatars/sarah.svg',
    },
    replies: [],
  },
  {
    id: 'review-2',
    userId: 'user-2',
    productId: 'product-1',
    courseId: null,
    rating: 4,
    title: 'Great value for money',
    content: 'Really good content overall. I learned a lot from this. Would have given 5 stars if there were more advanced topics covered.',
    isVerified: true,
    isApproved: true,
    helpful: 12,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    user: {
      id: 'user-2',
      name: 'Michael Chen',
      image: '/avatars/marcus.svg',
    },
    replies: [
      {
        id: 'reply-1',
        reviewId: 'review-2',
        userId: 'creator-1',
        content: 'Thank you for the feedback! I\'m planning to add advanced modules soon.',
        createdAt: new Date('2024-01-11'),
        user: {
          id: 'creator-1',
          name: 'Creator',
        },
      },
    ],
  },
  {
    id: 'review-3',
    userId: 'user-3',
    productId: null,
    courseId: 'course-1',
    rating: 5,
    title: 'Life-changing course!',
    content: 'This course completely transformed my understanding of the subject. The instructor explains everything clearly and the exercises are very practical.',
    isVerified: true,
    isApproved: true,
    helpful: 45,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    user: {
      id: 'user-3',
      name: 'Emily Davis',
      image: '/avatars/emily.svg',
    },
    replies: [],
  },
  {
    id: 'review-4',
    userId: 'user-4',
    productId: 'product-1',
    courseId: null,
    rating: 3,
    title: 'Decent but could be better',
    content: 'The content is okay but I expected more depth. Some sections feel rushed.',
    isVerified: false,
    isApproved: true,
    helpful: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    user: {
      id: 'user-4',
      name: 'David Wilson',
      image: '/avatars/david.svg',
    },
    replies: [],
  },
  {
    id: 'review-5',
    userId: 'user-5',
    productId: null,
    courseId: 'course-1',
    rating: 4,
    title: 'Very helpful for beginners',
    content: 'Perfect for those just starting out. Clear explanations and good examples throughout.',
    isVerified: true,
    isApproved: true,
    helpful: 18,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    user: {
      id: 'user-5',
      name: 'Alex Thompson',
      image: '/avatars/user.svg',
    },
    replies: [],
  },
];

// GET /api/reviews - List reviews with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ghostMode = searchParams.get('ghost') === 'true';
    const productId = searchParams.get('productId');
    const courseId = searchParams.get('courseId');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, rating_high, rating_low, helpful
    const rating = searchParams.get('rating');
    const approved = searchParams.get('approved');

    // Return mock data for ghost mode
    if (ghostMode) {
      let filteredReviews = [...mockReviews];

      if (productId) {
        filteredReviews = filteredReviews.filter(r => r.productId === productId);
      }
      if (courseId) {
        filteredReviews = filteredReviews.filter(r => r.courseId === courseId);
      }
      if (rating) {
        filteredReviews = filteredReviews.filter(r => r.rating === parseInt(rating));
      }
      if (approved !== null) {
        filteredReviews = filteredReviews.filter(r => r.isApproved === (approved === 'true'));
      }

      // Sort reviews
      switch (sortBy) {
        case 'rating_high':
          filteredReviews.sort((a, b) => b.rating - a.rating);
          break;
        case 'rating_low':
          filteredReviews.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          filteredReviews.sort((a, b) => b.helpful - a.helpful);
          break;
        case 'recent':
        default:
          filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      // Calculate summary stats
      const totalReviews = filteredReviews.length;
      const averageRating = totalReviews > 0
        ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: filteredReviews.filter(r => r.rating === star).length,
      }));

      return NextResponse.json({
        reviews: filteredReviews,
        summary: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
        },
      });
    }

    // Build where clause for real data
    const where: Record<string, unknown> = {};
    if (productId) where.productId = productId;
    if (courseId) where.courseId = courseId;
    if (rating) where.rating = parseInt(rating);
    if (approved !== null) where.isApproved = approved === 'true';

    // Build orderBy
    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'rating_high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating_low':
        orderBy = { rating: 'asc' };
        break;
      case 'helpful':
        orderBy = { helpful: 'desc' };
        break;
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy,
    });

    // Calculate summary stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
    }));

    return NextResponse.json({
      reviews,
      summary: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, courseId, rating, title, content, isVerified } = body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this product/course
    const existingReview = await db.review.findFirst({
      where: {
        userId,
        ...(productId ? { productId } : { courseId }),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this item' },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        userId,
        productId: productId || null,
        courseId: courseId || null,
        rating,
        title,
        content,
        isVerified: isVerified || false,
        isApproved: false, // Reviews need approval by default
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
