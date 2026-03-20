// Course Types for CreatorHub

// Video type enum
export type VideoType = 'youtube' | 'vimeo' | 'upload';

// Drip type enum matching Prisma schema
export type DripType = 'immediate' | 'scheduled' | 'after_previous';

// Lesson interface matching Prisma schema
export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  videoType: VideoType | null;
  duration: number | null; // in seconds
  order: number;
  preview: boolean;
  createdAt: Date;
  updatedAt: Date;
  moduleId: string;
}

// Module interface matching Prisma schema
export interface Module {
  id: string;
  title: string;
  order: number;
  // Drip content settings
  dripType: DripType;
  dripDate: Date | null; // For scheduled drip - the date when module becomes available
  dripDays: number | null; // For after_previous drip - days after enrollment or previous module
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  lessons: Lesson[];
}

// Course interface matching Prisma schema
export interface Course {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  price: number;
  published: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  modules?: Module[];
}

// Course with modules for display
export interface CourseWithModules extends Course {
  modules: Module[];
}

// Lesson input for create/update
export interface LessonInput {
  title: string;
  description?: string;
  videoUrl?: string;
  videoType?: VideoType;
  duration?: number;
  order: number;
  preview: boolean;
}

// Module input for create/update
export interface ModuleInput {
  title: string;
  order: number;
  dripType?: DripType;
  dripDate?: Date | null;
  dripDays?: number | null;
  lessons?: LessonInput[];
}

// Course form input for create/update
export interface CourseInput {
  title: string;
  description?: string;
  image?: string;
  price: number;
  published: boolean;
}

// Course API response
export interface CourseApiResponse {
  success: boolean;
  data?: Course;
  error?: string;
}

// Course list API response
export interface CourseListApiResponse {
  success: boolean;
  data?: Course[];
  error?: string;
}

// Course with stats for dashboard display
export interface CourseDashboardDisplay extends Course {
  modulesCount: number;
  lessonsCount: number;
  revenue: number;
}

// Mock course data for ghost mode
export const mockCourses: CourseWithModules[] = [
  {
    id: 'course-1',
    title: 'Build Your Creator Business',
    description: 'A complete course on building a sustainable creator business. Learn how to monetize your content, build products, and create multiple income streams.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    price: 199,
    published: true,
    enrollmentCount: 456,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    creatorId: 'ghost-user-id',
    modules: [
      {
        id: 'mod-1',
        title: 'Getting Started',
        order: 0,
        dripType: 'immediate',
        dripDate: null,
        dripDays: null,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        courseId: 'course-1',
        lessons: [
          { id: 'les-1', title: 'Welcome & Overview', description: null, videoUrl: 'https://vimeo.com/123', videoType: 'vimeo', duration: 330, order: 0, preview: true, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-1' },
          { id: 'les-2', title: 'Setting Your Goals', description: null, videoUrl: 'https://vimeo.com/124', videoType: 'vimeo', duration: 720, order: 1, preview: false, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-1' },
          { id: 'les-3', title: 'Finding Your Niche', description: null, videoUrl: 'https://vimeo.com/125', videoType: 'vimeo', duration: 1125, order: 2, preview: false, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-1' },
        ],
      },
      {
        id: 'mod-2',
        title: 'Content Strategy',
        order: 1,
        dripType: 'after_previous',
        dripDate: null,
        dripDays: 7,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        courseId: 'course-1',
        lessons: [
          { id: 'les-4', title: 'Content Planning', description: null, videoUrl: 'https://youtube.com/watch?v=abc', videoType: 'youtube', duration: 900, order: 0, preview: false, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-2' },
          { id: 'les-5', title: 'Creating Consistently', description: null, videoUrl: 'https://youtube.com/watch?v=def', videoType: 'youtube', duration: 1230, order: 1, preview: false, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-2' },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Instagram Growth Masterclass',
    description: 'Learn the exact strategies I used to grow to 100K followers. Covers content creation, hashtags, reels, stories, and engagement tactics.',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
    price: 79,
    published: true,
    enrollmentCount: 892,
    rating: 4.9,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-10'),
    creatorId: 'ghost-user-id',
    modules: [
      {
        id: 'mod-3',
        title: 'Foundation',
        order: 0,
        dripType: 'immediate',
        dripDate: null,
        dripDays: null,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        courseId: 'course-2',
        lessons: [
          { id: 'les-6', title: 'Profile Optimization', description: null, videoUrl: 'https://vimeo.com/126', videoType: 'vimeo', duration: 600, order: 0, preview: true, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-3' },
          { id: 'les-7', title: 'Content Pillars', description: null, videoUrl: 'https://vimeo.com/127', videoType: 'vimeo', duration: 930, order: 1, preview: false, createdAt: new Date(), updatedAt: new Date(), moduleId: 'mod-3' },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Email Marketing for Creators',
    description: 'Build your email list and create campaigns that convert. Learn automation, segmentation, and copywriting techniques.',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop',
    price: 149,
    published: false,
    enrollmentCount: 0,
    rating: 0,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    creatorId: 'ghost-user-id',
    modules: [],
  },
];

// Helper to format duration
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper to parse duration string to seconds
export function parseDuration(durationStr: string): number {
  const parts = durationStr.split(':').map(Number);
  
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  
  return 0;
}

// Helper to count total lessons in a course
export function countLessons(course: CourseWithModules): number {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

// Helper to calculate total duration in seconds
export function calculateTotalDuration(course: CourseWithModules): number {
  return course.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + (lesson.duration || 0);
    }, 0);
  }, 0);
}

// ============================================
// DRIP CONTENT HELPERS
// ============================================

/**
 * Check if a module is available based on drip settings
 * @param module The module to check
 * @param enrollmentDate The date the user enrolled in the course
 * @param previousModuleCompletionDate The date the previous module was completed (if applicable)
 * @returns Object with availability status and unlock date
 */
export function checkModuleAvailability(
  module: Module,
  enrollmentDate: Date,
  previousModuleCompletionDate?: Date | null
): { isAvailable: boolean; unlockDate: Date | null; reason: string } {
  const now = new Date();
  
  switch (module.dripType) {
    case 'immediate':
      return {
        isAvailable: true,
        unlockDate: null,
        reason: 'Available immediately upon enrollment'
      };
      
    case 'scheduled':
      if (!module.dripDate) {
        return {
          isAvailable: true,
          unlockDate: null,
          reason: 'No schedule set - available'
        };
      }
      
      const scheduledDate = new Date(module.dripDate);
      const isAvailable = now >= scheduledDate;
      
      return {
        isAvailable,
        unlockDate: isAvailable ? null : scheduledDate,
        reason: isAvailable 
          ? 'Scheduled date has passed' 
          : `Available on ${scheduledDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}`
      };
      
    case 'after_previous':
      if (!module.dripDays) {
        return {
          isAvailable: true,
          unlockDate: null,
          reason: 'No drip days set - available'
        };
      }
      
      // Use previous module completion date if available, otherwise use enrollment date
      const baseDate = previousModuleCompletionDate || enrollmentDate;
      const unlockDate = new Date(baseDate);
      unlockDate.setDate(unlockDate.getDate() + module.dripDays);
      
      const moduleIsAvailable = now >= unlockDate;
      
      return {
        isAvailable: moduleIsAvailable,
        unlockDate: moduleIsAvailable ? null : unlockDate,
        reason: moduleIsAvailable
          ? 'Drip period has passed'
          : `Available ${module.dripDays} days after ${previousModuleCompletionDate ? 'completing previous module' : 'enrollment'} (${unlockDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`
      };
      
    default:
      return {
        isAvailable: true,
        unlockDate: null,
        reason: 'Unknown drip type - available by default'
      };
  }
}

/**
 * Get drip status for all modules in a course
 * @param modules List of modules in order
 * @param enrollmentDate The date the user enrolled
 * @param completedModules Array of completed module IDs with completion dates
 * @returns Array of module availability info
 */
export function getCourseDripStatus(
  modules: Module[],
  enrollmentDate: Date,
  completedModules: { moduleId: string; completedAt: Date }[] = []
): { moduleId: string; isAvailable: boolean; unlockDate: Date | null; reason: string }[] {
  return modules.map((module, index) => {
    // For after_previous drip, find the previous module's completion date
    let previousModuleCompletionDate: Date | null = null;
    
    if (index > 0 && module.dripType === 'after_previous') {
      const prevModule = modules[index - 1];
      const prevCompletion = completedModules.find(c => c.moduleId === prevModule.id);
      previousModuleCompletionDate = prevCompletion?.completedAt || null;
    }
    
    const availability = checkModuleAvailability(module, enrollmentDate, previousModuleCompletionDate);
    
    return {
      moduleId: module.id,
      ...availability
    };
  });
}

/**
 * Format unlock date for display
 */
export function formatUnlockDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Calculate how many days until unlock
 */
export function getDaysUntilUnlock(unlockDate: Date): number {
  const now = new Date();
  const diffTime = unlockDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
