import { NextRequest, NextResponse } from 'next/server';
import { getMockAnalyticsData } from '@/lib/mock-data/dashboard';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Validate time range
    const validRanges = ['7d', '30d', '90d', '1y'];
    const validatedRange = validRanges.includes(timeRange) ? timeRange : '30d';
    
    const analyticsData = getMockAnalyticsData(validatedRange);
    
    return NextResponse.json({
      success: true,
      data: analyticsData,
      timeRange: validatedRange,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
