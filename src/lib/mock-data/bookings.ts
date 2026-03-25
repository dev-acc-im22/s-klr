// Mock data for bookings and availability

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface MockBooking {
  id: string;
  title: string;
  description: string | null;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  timezone: string;
  meetingUrl: string | null;
  notes: string | null;
  price: number;
  client: {
    name: string;
    email: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MockAvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}

export interface MockAvailabilitySettings {
  timezone: string;
  bufferTime: number; // minutes between bookings
  maxBookingsPerDay: number;
  slots: MockAvailabilitySlot[];
}

// Generate dates relative to today
function getRelativeDate(daysOffset: number, hour: number, minute: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

// Mock bookings data
export const mockBookings: MockBooking[] = [
  // Today's bookings
  {
    id: "BOOK-001",
    title: "1:1 Coaching Call - Content Strategy",
    description: "Discuss content strategy and growth plans for Q1",
    status: "confirmed",
    startTime: getRelativeDate(0, 10, 0),
    endTime: getRelativeDate(0, 11, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/123456789",
    notes: null,
    price: 150,
    client: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-2, 14, 30),
    updatedAt: getRelativeDate(-1, 9, 0),
  },
  {
    id: "BOOK-002",
    title: "Business Consultation",
    description: "Review business model and monetization strategies",
    status: "pending",
    startTime: getRelativeDate(0, 14, 0),
    endTime: getRelativeDate(0, 15, 30),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: null,
    price: 200,
    client: {
      name: "Michael Chen",
      email: "mike.chen@gmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-1, 11, 15),
    updatedAt: getRelativeDate(-1, 11, 15),
  },
  {
    id: "BOOK-003",
    title: "Quick Check-in Call",
    description: "Follow-up on previous coaching session",
    status: "completed",
    startTime: getRelativeDate(0, 9, 0),
    endTime: getRelativeDate(0, 9, 30),
    timezone: "America/New_York",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    notes: "Great progress! Client is ready to launch their first course.",
    price: 75,
    client: {
      name: "Emily Davis",
      email: "emily.davis@outlook.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-3, 16, 0),
    updatedAt: getRelativeDate(0, 9, 35),
  },
  
  // Tomorrow's bookings
  {
    id: "BOOK-004",
    title: "Instagram Growth Strategy",
    description: "Deep dive into Instagram growth tactics",
    status: "confirmed",
    startTime: getRelativeDate(1, 11, 0),
    endTime: getRelativeDate(1, 12, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/987654321",
    notes: null,
    price: 150,
    client: {
      name: "Alex Thompson",
      email: "alex.t@company.co",
      avatar: null,
    },
    createdAt: getRelativeDate(-4, 10, 0),
    updatedAt: getRelativeDate(-2, 15, 30),
  },
  {
    id: "BOOK-005",
    title: "YouTube Channel Review",
    description: "Channel audit and content recommendations",
    status: "pending",
    startTime: getRelativeDate(1, 15, 0),
    endTime: getRelativeDate(1, 16, 30),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: null,
    price: 175,
    client: {
      name: "Jordan Lee",
      email: "jordan.lee@me.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-1, 18, 45),
    updatedAt: getRelativeDate(-1, 18, 45),
  },
  
  // This week's bookings
  {
    id: "BOOK-006",
    title: "Course Launch Strategy",
    description: "Planning the launch of a new digital course",
    status: "confirmed",
    startTime: getRelativeDate(2, 10, 0),
    endTime: getRelativeDate(2, 11, 30),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/456789012",
    notes: null,
    price: 200,
    client: {
      name: "Rachel Kim",
      email: "rachel.kim@gmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-5, 9, 0),
    updatedAt: getRelativeDate(-3, 11, 0),
  },
  {
    id: "BOOK-007",
    title: "Email Marketing Workshop",
    description: "Setting up email sequences and automation",
    status: "confirmed",
    startTime: getRelativeDate(3, 14, 0),
    endTime: getRelativeDate(3, 15, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/789012345",
    notes: null,
    price: 125,
    client: {
      name: "David Wilson",
      email: "david.wilson@yahoo.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-6, 13, 30),
    updatedAt: getRelativeDate(-4, 10, 0),
  },
  {
    id: "BOOK-008",
    title: "Podcast Guest Preparation",
    description: "Preparing for podcast appearance and talking points",
    status: "pending",
    startTime: getRelativeDate(4, 16, 0),
    endTime: getRelativeDate(4, 17, 0),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: null,
    price: 100,
    client: {
      name: "Lisa Martinez",
      email: "lisa.martinez@icloud.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-2, 19, 0),
    updatedAt: getRelativeDate(-2, 19, 0),
  },
  
  // Next week's bookings
  {
    id: "BOOK-009",
    title: "Brand Partnership Strategy",
    description: "How to approach and negotiate brand deals",
    status: "confirmed",
    startTime: getRelativeDate(7, 10, 0),
    endTime: getRelativeDate(7, 11, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/234567890",
    notes: null,
    price: 175,
    client: {
      name: "James Brown",
      email: "j.brown@proton.me",
      avatar: null,
    },
    createdAt: getRelativeDate(-7, 11, 0),
    updatedAt: getRelativeDate(-5, 14, 0),
  },
  {
    id: "BOOK-010",
    title: "Content Calendar Planning",
    description: "Setting up a 30-day content calendar",
    status: "confirmed",
    startTime: getRelativeDate(8, 13, 0),
    endTime: getRelativeDate(8, 14, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/567890123",
    notes: null,
    price: 125,
    client: {
      name: "Amanda White",
      email: "amanda.w@hotmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-4, 16, 45),
    updatedAt: getRelativeDate(-2, 9, 30),
  },
  {
    id: "BOOK-011",
    title: "TikTok Growth Masterclass",
    description: "Strategies for growing on TikTok",
    status: "pending",
    startTime: getRelativeDate(9, 15, 0),
    endTime: getRelativeDate(9, 16, 30),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: null,
    price: 150,
    client: {
      name: "Chris Taylor",
      email: "chris.t@gmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-1, 20, 0),
    updatedAt: getRelativeDate(-1, 20, 0),
  },
  {
    id: "BOOK-012",
    title: "Passive Income Setup",
    description: "Creating digital products for passive income",
    status: "confirmed",
    startTime: getRelativeDate(10, 11, 0),
    endTime: getRelativeDate(10, 12, 30),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/890123456",
    notes: null,
    price: 200,
    client: {
      name: "Nicole Garcia",
      email: "nicole.g@studio.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-8, 10, 0),
    updatedAt: getRelativeDate(-6, 12, 0),
  },
  
  // Past bookings (completed)
  {
    id: "BOOK-013",
    title: "Quarterly Business Review",
    description: "Review Q4 performance and plan for Q1",
    status: "completed",
    startTime: getRelativeDate(-1, 10, 0),
    endTime: getRelativeDate(-1, 11, 30),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/123450987",
    notes: "Client achieved 40% revenue growth. Discussed scaling strategies.",
    price: 200,
    client: {
      name: "Kevin Anderson",
      email: "kevin.a@fastmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-5, 14, 0),
    updatedAt: getRelativeDate(-1, 11, 35),
  },
  {
    id: "BOOK-014",
    title: "Social Media Audit",
    description: "Complete audit of all social media channels",
    status: "completed",
    startTime: getRelativeDate(-3, 14, 0),
    endTime: getRelativeDate(-3, 15, 0),
    timezone: "America/New_York",
    meetingUrl: "https://meet.google.com/xyz-abc-123",
    notes: "Identified 3 key areas for improvement. Sent detailed report via email.",
    price: 150,
    client: {
      name: "Megan Robinson",
      email: "megan.r@hey.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-7, 11, 30),
    updatedAt: getRelativeDate(-3, 15, 5),
  },
  {
    id: "BOOK-015",
    title: "Newsletter Strategy Session",
    description: "Growing and monetizing email newsletter",
    status: "completed",
    startTime: getRelativeDate(-5, 9, 0),
    endTime: getRelativeDate(-5, 10, 0),
    timezone: "America/New_York",
    meetingUrl: "https://zoom.us/j/678901234",
    notes: "Client will implement paid newsletter tier. Follow up in 2 weeks.",
    price: 125,
    client: {
      name: "Brandon Scott",
      email: "brandon.s@live.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-10, 15, 0),
    updatedAt: getRelativeDate(-5, 10, 10),
  },
  
  // Cancelled bookings
  {
    id: "BOOK-016",
    title: "Product Launch Review",
    description: "Review digital product launch results",
    status: "cancelled",
    startTime: getRelativeDate(-2, 16, 0),
    endTime: getRelativeDate(-2, 17, 0),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: "Client cancelled due to scheduling conflict. Rescheduled for next week.",
    price: 150,
    client: {
      name: "Jennifer Moore",
      email: "jennifer.m@gmail.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-6, 12, 0),
    updatedAt: getRelativeDate(-2, 8, 0),
  },
  {
    id: "BOOK-017",
    title: "Sponsorship Negotiation Prep",
    description: "Preparing for brand sponsorship negotiation",
    status: "cancelled",
    startTime: getRelativeDate(-4, 11, 0),
    endTime: getRelativeDate(-4, 12, 0),
    timezone: "America/New_York",
    meetingUrl: null,
    notes: "Cancelled by client - brand deal fell through.",
    price: 175,
    client: {
      name: "Tyler Jackson",
      email: "tyler.j@outlook.com",
      avatar: null,
    },
    createdAt: getRelativeDate(-9, 17, 0),
    updatedAt: getRelativeDate(-4, 7, 30),
  },
];

// Default availability slots (typical 9-5 schedule)
export const defaultAvailabilitySlots: MockAvailabilitySlot[] = [
  { id: "slot-1", dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true }, // Monday
  { id: "slot-2", dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true }, // Tuesday
  { id: "slot-3", dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true }, // Wednesday
  { id: "slot-4", dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true }, // Thursday
  { id: "slot-5", dayOfWeek: 5, startTime: "09:00", endTime: "15:00", isActive: true }, // Friday (shorter day)
  { id: "slot-6", dayOfWeek: 6, startTime: "10:00", endTime: "14:00", isActive: false }, // Saturday (optional)
  { id: "slot-7", dayOfWeek: 0, startTime: "10:00", endTime: "14:00", isActive: false }, // Sunday (off)
];

// Default availability settings
export const defaultAvailabilitySettings: MockAvailabilitySettings = {
  timezone: "America/New_York",
  bufferTime: 15, // 15 minutes between bookings
  maxBookingsPerDay: 5,
  slots: defaultAvailabilitySlots,
};

// Helper functions for bookings
export function getMockBookings(status?: string, dateRange?: { start: Date; end: Date }): MockBooking[] {
  let filtered = [...mockBookings];
  
  if (status && status !== 'all') {
    filtered = filtered.filter(booking => booking.status === status);
  }
  
  if (dateRange) {
    filtered = filtered.filter(booking => {
      const startTime = new Date(booking.startTime);
      return startTime >= dateRange.start && startTime <= dateRange.end;
    });
  }
  
  return filtered.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export function getMockBookingById(id: string): MockBooking | null {
  return mockBookings.find(booking => booking.id === id) || null;
}

export function getTodayBookings(): MockBooking[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getMockBookings(undefined, { start: today, end: tomorrow });
}

export function getUpcomingBookings(limit: number = 5): MockBooking[] {
  const now = new Date();
  return mockBookings
    .filter(booking => 
      new Date(booking.startTime) > now && 
      (booking.status === 'confirmed' || booking.status === 'pending')
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, limit);
}

export function getBookingsByDate(date: Date): MockBooking[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return getMockBookings(undefined, { start: startOfDay, end: endOfDay });
}

export function getBookingsForMonth(year: number, month: number): MockBooking[] {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  return getMockBookings(undefined, { start: startOfMonth, end: endOfMonth });
}

// Get booking counts by status
export function getBookingStats() {
  const stats = {
    total: mockBookings.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    thisWeek: 0,
    today: 0,
    revenue: 0,
  };
  
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  mockBookings.forEach(booking => {
    if (booking.status === 'pending') stats.pending++;
    else if (booking.status === 'confirmed') stats.confirmed++;
    else if (booking.status === 'completed') stats.completed++;
    else if (booking.status === 'cancelled') stats.cancelled++;
    
    // This week's bookings
    const bookingDate = new Date(booking.startTime);
    if (bookingDate >= now && bookingDate <= weekEnd && booking.status !== 'cancelled') {
      stats.thisWeek++;
    }
    
    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (bookingDate >= today && bookingDate < tomorrow) {
      stats.today++;
    }
    
    // Revenue (only completed and confirmed)
    if (booking.status === 'completed' || booking.status === 'confirmed') {
      stats.revenue += booking.price;
    }
  });
  
  return stats;
}

// Format date for display
export function formatBookingDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatBookingTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatBookingDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min`;
  }
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// Timezone options
export const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

// Day names
export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
