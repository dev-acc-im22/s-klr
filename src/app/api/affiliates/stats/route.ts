import { NextRequest, NextResponse } from 'next/server'
import { 
  mockAffiliateStats,
  mockAffiliateClicks,
  mockAffiliateSales,
  mockAffiliates,
  mockMyAffiliateData,
  mockAffiliateLinkHistory
} from '@/lib/mock-data/features'

// GET /api/affiliates/stats - Get affiliate statistics
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'creator' // 'creator' or 'affiliate'
  const period = searchParams.get('period') || 'all' // 'all', 'month', 'week'

  if (type === 'affiliate') {
    // Return stats for the current user as an affiliate
    return NextResponse.json({
      myData: mockMyAffiliateData,
      linkHistory: mockAffiliateLinkHistory,
      recentClicks: mockAffiliateClicks.slice(0, 5),
      recentSales: mockAffiliateSales.slice(0, 5),
    })
  }

  // Creator stats
  const now = new Date()
  let startDate: Date | null = null

  if (period === 'week') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (period === 'month') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // Filter clicks by period
  let filteredClicks = [...mockAffiliateClicks]
  if (startDate) {
    filteredClicks = filteredClicks.filter(
      (click) => new Date(click.createdAt) >= startDate
    )
  }

  // Filter sales by period
  let filteredSales = [...mockAffiliateSales]
  if (startDate) {
    filteredSales = filteredSales.filter(
      (sale) => new Date(sale.createdAt) >= startDate
    )
  }

  // Calculate stats for the period
  const periodClicks = filteredClicks.length
  const periodConversions = filteredSales.length
  const periodEarnings = filteredSales.reduce((sum, sale) => sum + sale.commission, 0)

  // Top performing affiliates
  const topAffiliates = [...mockAffiliates]
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5)
    .map((affiliate) => ({
      id: affiliate.id,
      code: affiliate.code,
      name: affiliate.user.name,
      clicks: affiliate.clicks,
      conversions: affiliate.conversions,
      earnings: affiliate.earnings,
    }))

  // Click trends (last 7 days)
  const clickTrends = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayClicks = mockAffiliateClicks.filter((click) => {
      const clickDate = new Date(click.createdAt)
      return (
        clickDate.getDate() === date.getDate() &&
        clickDate.getMonth() === date.getMonth() &&
        clickDate.getFullYear() === date.getFullYear()
      )
    })
    clickTrends.push({
      date: date.toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 50) + 20, // Simulated data for chart
    })
  }

  // Conversion trends (last 7 days)
  const conversionTrends = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    conversionTrends.push({
      date: date.toISOString().split('T')[0],
      conversions: Math.floor(Math.random() * 10) + 2, // Simulated data for chart
      earnings: Math.floor(Math.random() * 500) + 100, // Simulated data for chart
    })
  }

  return NextResponse.json({
    stats: mockAffiliateStats,
    periodStats: {
      clicks: periodClicks,
      conversions: periodConversions,
      earnings: periodEarnings,
    },
    topAffiliates,
    clickTrends,
    conversionTrends,
    recentClicks: filteredClicks.slice(0, 10),
    recentSales: filteredSales.slice(0, 10),
  })
}
