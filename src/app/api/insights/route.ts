import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Types for insights
export interface Insight {
  id: string;
  type: 'trend' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'revenue' | 'products' | 'customers' | 'marketing' | 'courses';
  actionable: boolean;
  action?: {
    label: string;
    href: string;
  };
  metric?: {
    value: string;
    change?: number;
    changeDirection?: 'up' | 'down';
  };
  createdAt: string;
}

export interface InsightsResponse {
  insights: Insight[];
  summary: {
    totalRevenue: number;
    revenueChange: number;
    totalSales: number;
    salesChange: number;
    topProduct: string;
    topProductRevenue: number;
    conversionRate: number;
    conversionChange: number;
  };
  recommendations: Recommendation[];
  generatedAt: string;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: 'pricing' | 'marketing' | 'content' | 'engagement' | 'products';
  expectedImpact: string;
  actions: string[];
}

// Mock data for context
const getMockAnalyticsContext = () => ({
  revenue: {
    thisMonth: 12450,
    lastMonth: 10200,
    change: 22.1,
  },
  products: [
    { id: 'prod-1', title: 'Content Creator Starter Kit', price: 29, sales: 89, revenue: 2581, category: 'Templates' },
    { id: 'prod-2', title: 'Social Media Strategy Guide', price: 49, sales: 67, revenue: 3283, category: 'E-book' },
    { id: 'prod-3', title: 'Email Marketing Templates', price: 19, sales: 134, revenue: 2546, category: 'Templates' },
    { id: 'prod-4', title: 'Thumbnail Design Pack', price: 15, sales: 98, revenue: 1470, category: 'Templates' },
  ],
  courses: [
    { id: 'course-1', title: 'Build Your Creator Business', price: 199, enrollments: 23, revenue: 4577, completionRate: 78 },
    { id: 'course-2', title: 'Instagram Growth Masterclass', price: 79, enrollments: 45, revenue: 3555, completionRate: 65 },
    { id: 'course-3', title: 'Email Marketing Bootcamp', price: 59, enrollments: 88, revenue: 5192, completionRate: 82 },
  ],
  customers: {
    total: 156,
    new: 34,
    returning: 122,
    avgOrderValue: 48.50,
  },
  traffic: {
    sources: [
      { source: 'Instagram', visitors: 2890, percentage: 23 },
      { source: 'Direct', visitors: 4523, percentage: 36 },
      { source: 'YouTube', visitors: 2156, percentage: 17 },
      { source: 'Twitter', visitors: 1234, percentage: 10 },
    ],
    conversionRate: 3.2,
    previousConversionRate: 2.7,
  },
  emailMarketing: {
    subscribers: 2450,
    openRate: 24.5,
    clickRate: 4.2,
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const context = searchParams.get('context') || 'dashboard';
    
    // Get mock analytics data for context
    const analyticsContext = getMockAnalyticsContext();
    
    // Generate AI-powered insights
    const zai = await ZAI.create();
    
    const systemPrompt = `You are an expert business analyst specializing in creator economy and digital products. You analyze data to provide actionable insights and recommendations that help creators grow their business.

Analyze the provided data and generate insights in these categories:
1. Revenue trends and opportunities
2. Product performance and optimization
3. Customer behavior patterns
4. Marketing effectiveness
5. Course engagement and completion

For each insight, provide:
- Clear title
- Detailed description with specific data points
- Impact level (high/medium/low)
- Whether it's actionable
- Suggested action if applicable

Also provide prioritized recommendations with:
- Priority level
- Expected impact
- Specific action steps`;

    const userPrompt = `Analyze this creator's business data and generate actionable insights:

**Revenue:**
- This Month: $${analyticsContext.revenue.thisMonth.toLocaleString()}
- Last Month: $${analyticsContext.revenue.lastMonth.toLocaleString()}
- Change: +${analyticsContext.revenue.change}%

**Top Products:**
${analyticsContext.products.map(p => `- ${p.title}: $${p.revenue} revenue, ${p.sales} sales, $${p.price} price`).join('\n')}

**Courses:**
${analyticsContext.courses.map(c => `- ${c.title}: $${c.revenue} revenue, ${c.enrollments} students, ${c.completionRate}% completion rate`).join('\n')}

**Customers:**
- Total: ${analyticsContext.customers.total}
- New this month: ${analyticsContext.customers.new}
- Returning: ${analyticsContext.customers.returning}
- Average Order Value: $${analyticsContext.customers.avgOrderValue}

**Traffic Sources:**
${analyticsContext.traffic.sources.map(s => `- ${s.source}: ${s.visitors} visitors (${s.percentage}%)`).join('\n')}
- Conversion Rate: ${analyticsContext.traffic.conversionRate}% (was ${analyticsContext.traffic.previousConversionRate}%)

**Email Marketing:**
- Subscribers: ${analyticsContext.emailMarketing.subscribers}
- Open Rate: ${analyticsContext.emailMarketing.openRate}%
- Click Rate: ${analyticsContext.emailMarketing.clickRate}%

Generate 5-7 specific, actionable insights and 3-5 prioritized recommendations. Return as JSON with this structure:
{
  "insights": [
    {
      "type": "trend|recommendation|alert|opportunity",
      "title": "string",
      "description": "string with specific numbers",
      "impact": "high|medium|low",
      "category": "revenue|products|customers|marketing|courses",
      "actionable": boolean,
      "action": { "label": "string", "href": "string" },
      "metric": { "value": "string", "change": number, "changeDirection": "up|down" }
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "title": "string",
      "description": "string",
      "category": "pricing|marketing|content|engagement|products",
      "expectedImpact": "string",
      "actions": ["string"]
    }
  ]
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;

    let parsedInsights;
    if (responseContent) {
      try {
        // Extract JSON from response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedInsights = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fall through to default insights
      }
    }

    // If we couldn't parse AI response, use default insights
    if (!parsedInsights || !parsedInsights.insights) {
      parsedInsights = generateDefaultInsights(analyticsContext);
    }

    // Add IDs and timestamps to insights
    const insights: Insight[] = (parsedInsights.insights || []).map((insight: Partial<Insight>, index: number) => ({
      id: `insight-${index + 1}`,
      type: insight.type || 'trend',
      title: insight.title || 'Insight',
      description: insight.description || '',
      impact: insight.impact || 'medium',
      category: insight.category || 'revenue',
      actionable: insight.actionable ?? true,
      action: insight.action,
      metric: insight.metric,
      createdAt: new Date().toISOString(),
    }));

    // Add IDs to recommendations
    const recommendations: Recommendation[] = (parsedInsights.recommendations || []).map((rec: Partial<Recommendation>, index: number) => ({
      id: `rec-${index + 1}`,
      priority: rec.priority || 'medium',
      title: rec.title || 'Recommendation',
      description: rec.description || '',
      category: rec.category || 'marketing',
      expectedImpact: rec.expectedImpact || 'Moderate improvement expected',
      actions: rec.actions || [],
    }));

    const response: InsightsResponse = {
      insights,
      summary: {
        totalRevenue: analyticsContext.revenue.thisMonth,
        revenueChange: analyticsContext.revenue.change,
        totalSales: analyticsContext.products.reduce((acc, p) => acc + p.sales, 0) + 
                    analyticsContext.courses.reduce((acc, c) => acc + c.enrollments, 0),
        salesChange: 15.3,
        topProduct: analyticsContext.products[1].title, // Social Media Strategy Guide
        topProductRevenue: analyticsContext.products[1].revenue,
        conversionRate: analyticsContext.traffic.conversionRate,
        conversionChange: ((analyticsContext.traffic.conversionRate - analyticsContext.traffic.previousConversionRate) / analyticsContext.traffic.previousConversionRate) * 100,
      },
      recommendations,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: response,
      context,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    
    // Return default insights on error
    const defaultResponse: InsightsResponse = {
      insights: generateDefaultInsights(getMockAnalyticsContext()).insights.map((insight: Partial<Insight>, index: number) => ({
        id: `insight-${index + 1}`,
        type: insight.type || 'trend',
        title: insight.title || 'Insight',
        description: insight.description || '',
        impact: insight.impact || 'medium',
        category: insight.category || 'revenue',
        actionable: insight.actionable ?? true,
        action: insight.action,
        createdAt: new Date().toISOString(),
      })),
      summary: {
        totalRevenue: 12450,
        revenueChange: 22.1,
        totalSales: 446,
        salesChange: 15.3,
        topProduct: 'Social Media Strategy Guide',
        topProductRevenue: 3283,
        conversionRate: 3.2,
        conversionChange: 18.5,
      },
      recommendations: generateDefaultInsights(getMockAnalyticsContext()).recommendations.map((rec: Partial<Recommendation>, index: number) => ({
        id: `rec-${index + 1}`,
        priority: rec.priority || 'medium',
        title: rec.title || 'Recommendation',
        description: rec.description || '',
        category: rec.category || 'marketing',
        expectedImpact: rec.expectedImpact || 'Moderate improvement expected',
        actions: rec.actions || [],
      })),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: defaultResponse,
    });
  }
}

function generateDefaultInsights(context: ReturnType<typeof getMockAnalyticsContext>) {
  return {
    insights: [
      {
        type: 'trend',
        title: 'Strong Revenue Growth',
        description: `Your revenue increased by ${context.revenue.change}% this month, reaching $${context.revenue.thisMonth.toLocaleString()}. This is $${(context.revenue.thisMonth - context.revenue.lastMonth).toLocaleString()} more than last month.`,
        impact: 'high',
        category: 'revenue',
        actionable: false,
        metric: {
          value: `$${context.revenue.thisMonth.toLocaleString()}`,
          change: context.revenue.change,
          changeDirection: 'up' as const,
        },
      },
      {
        type: 'opportunity',
        title: 'Email Marketing Templates is Underpriced',
        description: `With 134 sales at $19, this product has high demand but low price point. Consider testing a price increase to $24-29 to potentially increase revenue by 26-52% without significantly impacting sales volume.`,
        impact: 'high',
        category: 'products',
        actionable: true,
        action: {
          label: 'Edit Product',
          href: '/dashboard/products/prod-3',
        },
      },
      {
        type: 'alert',
        title: 'Instagram Growth Course Has Lower Completion',
        description: `Your Instagram Growth Masterclass has a 65% completion rate, lower than your other courses (78-82%). Consider reviewing the content structure or adding engagement elements.`,
        impact: 'medium',
        category: 'courses',
        actionable: true,
        action: {
          label: 'View Course',
          href: '/dashboard/courses/course-2',
        },
      },
      {
        type: 'recommendation',
        title: 'Conversion Rate Improving',
        description: `Your conversion rate improved from ${context.traffic.previousConversionRate}% to ${context.traffic.conversionRate}%, a ${(((context.traffic.conversionRate - context.traffic.previousConversionRate) / context.traffic.previousConversionRate) * 100).toFixed(1)}% increase. Keep optimizing your checkout flow.`,
        impact: 'medium',
        category: 'marketing',
        actionable: false,
        metric: {
          value: `${context.traffic.conversionRate}%`,
          change: 18.5,
          changeDirection: 'up' as const,
        },
      },
      {
        type: 'opportunity',
        title: 'High Returning Customer Rate',
        description: `${context.customers.returning} of ${context.customers.total} customers (${Math.round((context.customers.returning / context.customers.total) * 100)}%) are returning buyers. Consider launching a loyalty program or exclusive offers for repeat customers.`,
        impact: 'high',
        category: 'customers',
        actionable: true,
        action: {
          label: 'Create Discount',
          href: '/dashboard/discounts/new',
        },
      },
      {
        type: 'trend',
        title: 'Direct Traffic Dominates',
        description: `Direct traffic accounts for ${context.traffic.sources[1].percentage}% of visitors. Your brand recognition is strong. Consider leveraging this with referral incentives.`,
        impact: 'medium',
        category: 'marketing',
        actionable: true,
        action: {
          label: 'Setup Affiliates',
          href: '/dashboard/affiliates',
        },
      },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Optimize Product Pricing',
        description: 'Your Email Marketing Templates product has high sales volume but a low price point. A/B test a higher price to maximize revenue.',
        category: 'pricing',
        expectedImpact: 'Potential 20-40% revenue increase',
        actions: [
          'Create a test variant at $24',
          'Monitor sales for 2 weeks',
          'Analyze conversion rate impact',
        ],
      },
      {
        priority: 'high',
        title: 'Improve Course Engagement',
        description: 'The Instagram Growth Masterclass has the lowest completion rate. Add quizzes, downloadable resources, or break into smaller modules.',
        category: 'content',
        expectedImpact: '10-15% increase in completion rate',
        actions: [
          'Review drop-off points in analytics',
          'Add interactive elements',
          'Include bonus materials for completion',
        ],
      },
      {
        priority: 'medium',
        title: 'Launch Email Nurture Sequence',
        description: 'With 2,450 subscribers and a 24.5% open rate, create automated email sequences to convert subscribers into customers.',
        category: 'marketing',
        expectedImpact: '5-10% increase in subscriber-to-customer conversion',
        actions: [
          'Create a welcome email series',
          'Segment subscribers by interest',
          'Add product recommendations',
        ],
      },
      {
        priority: 'medium',
        title: 'Create Product Bundles',
        description: 'Bundle your Template products (Starter Kit, Email Templates, Thumbnail Pack) for a higher-value offering.',
        category: 'products',
        expectedImpact: '15-25% increase in average order value',
        actions: [
          'Create a "Creator Toolkit" bundle',
          'Set bundle price at 15% discount',
          'Promote on product pages',
        ],
      },
    ],
  };
}
