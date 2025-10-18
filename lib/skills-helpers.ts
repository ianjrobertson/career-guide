import {getUserAttempts, MOCK_SKILLS, type Skill, type UserProblemAttempt} from './mock-data';

// Skill status based on user's interaction
export type SkillStatus = 'not-tried'|'tried'|'enjoyed'|'disliked';

// Enriched skill with user attempt data
export interface SkillWithStatus extends Skill {
  skill_id?: number;    // From Supabase
  skill_name?: string;  // From Supabase
  status: SkillStatus;
  userLiked?: boolean|null;  // User's rating: liked or disliked
  attemptData?: {
    enjoymentRating: number; difficultyRating: number; timeSpent: number;
    lastAttemptDate: string;
    notes?: string;
  };
}

// Pagination settings
export const ITEMS_PER_PAGE = 12;

/**
 * Determine skill status based on user attempts
 */
export function getSkillStatus(
    skillId: string, attempts: UserProblemAttempt[]): SkillStatus {
  const skillAttempts =
      attempts.filter(a => a.skill_id === skillId && a.completed);

  if (skillAttempts.length === 0) {
    return 'not-tried';
  }

  // Get the most recent attempt
  const latestAttempt = skillAttempts.sort(
      (a, b) => new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime())[0];

  // Determine status based on enjoyment rating
  if (latestAttempt.enjoyment_rating >= 4) {
    return 'enjoyed';
  } else if (latestAttempt.enjoyment_rating <= 2) {
    return 'disliked';
  } else {
    return 'tried';
  }
}

/**
 * Get attempt data for a skill
 */
export function getSkillAttemptData(
    skillId: string,
    attempts: UserProblemAttempt[]): SkillWithStatus['attemptData']|undefined {
  const skillAttempts =
      attempts.filter(a => a.skill_id === skillId && a.completed);

  if (skillAttempts.length === 0) {
    return undefined;
  }

  // Get the most recent attempt
  const latestAttempt = skillAttempts.sort(
      (a, b) => new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime())[0];

  return {
    enjoymentRating: latestAttempt.enjoyment_rating,
    difficultyRating: latestAttempt.difficulty_rating,
    timeSpent: latestAttempt.time_spent_minutes,
    lastAttemptDate: latestAttempt.created_at,
    notes: latestAttempt.notes
  };
}

/**
 * Enrich skills with user status and attempt data
 */
export function getSkillsWithStatus(userId: string = 'mock-user-1'):
    SkillWithStatus[] {
  const attempts = getUserAttempts(userId);

  return MOCK_SKILLS.map(skill => {
    const status = getSkillStatus(skill.id, attempts);
    const attemptData = getSkillAttemptData(skill.id, attempts);

    return {...skill, status, attemptData};
  });
}

/**
 * Filter skills by major(s)
 */
export function filterSkillsByMajor(
    skills: SkillWithStatus[], majorIds: string[]): SkillWithStatus[] {
  if (majorIds.length === 0) {
    return skills;
  }

  return skills.filter(
      skill => majorIds.some(majorId => skill.major_ids.includes(majorId)));
}

/**
 * Filter skills by category
 */
export function filterSkillsByCategory(
    skills: SkillWithStatus[], category: string|null): SkillWithStatus[] {
  if (!category) {
    return skills;
  }

  return skills.filter(skill => skill.category === category);
}

/**
 * Search skills by name or description
 */
export function searchSkills(
    skills: SkillWithStatus[], query: string): SkillWithStatus[] {
  if (!query || query.trim() === '') {
    return skills;
  }

  const lowerQuery = query.toLowerCase().trim();

  return skills.filter(
      skill => (skill.skill_name || skill.name || '')
                   .toLowerCase()
                   .includes(lowerQuery) ||
          (skill.description || '').toLowerCase().includes(lowerQuery));
}

/**
 * Get unique skill categories
 */
export function getUniqueCategories(): string[] {
  const categories = new Set(MOCK_SKILLS.map(skill => skill.category));
  return Array.from(categories).sort();
}

/**
 * Paginate skills
 */
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginateSkills(skills: SkillWithStatus[], page: number = 1):
    PaginatedResult<SkillWithStatus> {
  const totalItems = skills.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const items = skills.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}

/**
 * Apply all filters to skills
 */
export interface SkillFilters {
  majorIds?: string[];
  category?: string|null;
  searchQuery?: string;
}

export function applyFilters(
    skills: SkillWithStatus[], filters: SkillFilters): SkillWithStatus[] {
  let filtered = skills;

  // Apply major filter
  if (filters.majorIds && filters.majorIds.length > 0) {
    filtered = filterSkillsByMajor(filtered, filters.majorIds);
  }

  // Apply category filter
  if (filters.category) {
    filtered = filterSkillsByCategory(filtered, filters.category);
  }

  // Apply search filter
  if (filters.searchQuery) {
    filtered = searchSkills(filtered, filters.searchQuery);
  }

  return filtered;
}

/**
 * Get status color classes for UI
 */
export function getStatusColorClasses(status: SkillStatus):
    {border: string; bg: string; text: string; badge: string;} {
  switch (status) {
    case 'enjoyed':
      return {
        border: 'border-green-500',
        bg: 'bg-green-50 dark:bg-green-950',
        text: 'text-green-700 dark:text-green-300',
        badge:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      };
    case 'disliked':
      return {
        border: 'border-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-950',
        text: 'text-orange-700 dark:text-orange-300',
        badge:
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      };
    case 'tried':
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      };
    case 'not-tried':
    default:
      return {
        border: 'border-border',
        bg: 'bg-card',
        text: 'text-muted-foreground',
        badge: 'bg-secondary text-secondary-foreground'
      };
  }
}

/**
 * Get status display text
 */
export function getStatusText(status: SkillStatus): string {
  switch (status) {
    case 'enjoyed':
      return 'Enjoyed';
    case 'disliked':
      return 'Tried';
    case 'tried':
      return 'Completed';
    case 'not-tried':
    default:
      return 'Not Tried';
  }
}
