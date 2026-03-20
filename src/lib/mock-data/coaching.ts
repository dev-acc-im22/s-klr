// Mock data for coaching sessions

export interface CoachingPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  features: string[];
  popular?: boolean;
}

export interface CoachingSession {
  id: string;
  packageId: string;
  packageName: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  scheduledAt: Date;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingUrl?: string;
  notes?: string;
  recordingUrl?: string;
  followUpActions?: string[];
  createdAt: Date;
}

export const coachingPackages: CoachingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Discovery Call',
    description: 'A quick intro session to discuss your goals and see if we\'re a good fit to work together.',
    duration: 30,
    price: 49,
    features: [
      '30-minute video call',
      'Goal assessment',
      'Action plan outline',
      'Follow-up email summary',
    ],
  },
  {
    id: 'pkg-2',
    name: 'Strategy Session',
    description: 'Deep dive into your business strategy with actionable recommendations and a clear roadmap.',
    duration: 60,
    price: 149,
    features: [
      '60-minute video call',
      'Comprehensive strategy review',
      'Custom action plan',
      'Resource recommendations',
      'Follow-up email summary',
      '1 week of email support',
    ],
    popular: true,
  },
  {
    id: 'pkg-3',
    name: 'Deep Dive',
    description: 'Intensive session for serious creators ready to scale. Includes hands-on guidance and detailed feedback.',
    duration: 90,
    price: 299,
    features: [
      '90-minute video call',
      'Full business audit',
      'Custom growth strategy',
      'Content calendar template',
      'Priority email support (2 weeks)',
      'Recording of session',
      'Bonus resources',
    ],
  },
];

export const upcomingSessions: CoachingSession[] = [
  {
    id: 'session-1',
    packageId: 'pkg-2',
    packageName: 'Strategy Session',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    price: 149,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/123456789',
    notes: 'Focus on Instagram growth strategy. Client wants to reach 10K followers in 3 months.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-2',
    packageId: 'pkg-3',
    packageName: 'Deep Dive',
    clientName: 'Mike Chen',
    clientEmail: 'mike@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 90,
    price: 299,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/987654321',
    notes: 'Content strategy overhaul. Client is pivoting to YouTube.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-3',
    packageId: 'pkg-1',
    packageName: 'Discovery Call',
    clientName: 'Emma Wilson',
    clientEmail: 'emma@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    duration: 30,
    price: 49,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-4',
    packageId: 'pkg-2',
    packageName: 'Strategy Session',
    clientName: 'David Park',
    clientEmail: 'david@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    duration: 60,
    price: 149,
    status: 'confirmed',
    notes: 'Email marketing optimization session.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-5',
    packageId: 'pkg-1',
    packageName: 'Discovery Call',
    clientName: 'Lisa Thompson',
    clientEmail: 'lisa@example.com',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    duration: 30,
    price: 49,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export const completedSessions: CoachingSession[] = [
  {
    id: 'session-completed-1',
    packageId: 'pkg-2',
    packageName: 'Strategy Session',
    clientName: 'Alex Rivera',
    clientEmail: 'alex@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 60,
    price: 149,
    status: 'completed',
    recordingUrl: 'https://drive.google.com/file/d/abc123',
    notes: 'Discussed content calendar creation and batch filming workflow.',
    followUpActions: [
      'Send content calendar template',
      'Share batch filming checklist',
      'Follow up on progress in 2 weeks',
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-completed-2',
    packageId: 'pkg-3',
    packageName: 'Deep Dive',
    clientName: 'Jennifer Lee',
    clientEmail: 'jennifer@example.com',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    duration: 90,
    price: 299,
    status: 'completed',
    recordingUrl: 'https://drive.google.com/file/d/def456',
    notes: 'Full business audit completed. Created 90-day growth roadmap.',
    followUpActions: [
      'Send custom growth roadmap document',
      'Share recommended tools list',
      'Schedule follow-up call in 30 days',
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-completed-3',
    packageId: 'pkg-1',
    packageName: 'Discovery Call',
    clientName: 'Robert Kim',
    clientEmail: 'robert@example.com',
    scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    duration: 30,
    price: 49,
    status: 'completed',
    notes: 'Intro call - interested in full coaching program.',
    followUpActions: [
      'Send coaching package details',
      'Add to email list',
    ],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
];

// Stats for coaching overview
export const coachingStats = {
  totalSessions: 28,
  thisMonth: 8,
  revenue: 4250,
  upcomingBookings: 5,
  avgRating: 4.9,
  completionRate: 95,
};

// Time slots for scheduling
export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export function getCoachingPackage(id: string): CoachingPackage | undefined {
  return coachingPackages.find(p => p.id === id);
}

export function getUpcomingSessions(): CoachingSession[] {
  return upcomingSessions;
}

export function getCompletedSessions(): CoachingSession[] {
  return completedSessions;
}

export function getAllSessions(): CoachingSession[] {
  return [...upcomingSessions, ...completedSessions].sort(
    (a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime()
  );
}
