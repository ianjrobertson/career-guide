import {
  getUserAttempts,
  getUserRecommendations,
  getSkillById,
  getMajorById,
  MOCK_SKILLS,
  type UserProblemAttempt,
  type MajorRecommendation,
  type Skill
} from './mock-data';

// Dashboard Stats
export interface DashboardStats {
  skillsExplored: number;
  problemsCompleted: number;
  totalTimeSpent: number; // in minutes
  recommendationsAvailable: number;
  averageEnjoyment: number; // 1-5 scale
}

export function getDashboardStats(userId: string = 'mock-user-1'): DashboardStats {
  const attempts = getUserAttempts(userId);
  const recommendations = getUserRecommendations(userId);

  // Get unique skills from attempts
  const uniqueSkills = new Set(attempts.map(a => a.skill_id));

  // Calculate total time spent
  const totalTime = attempts.reduce((sum, attempt) => sum + attempt.time_spent_minutes, 0);

  // Calculate average enjoyment (only for completed attempts)
  const completedAttempts = attempts.filter(a => a.completed);
  const avgEnjoyment = completedAttempts.length > 0
    ? completedAttempts.reduce((sum, a) => sum + a.enjoyment_rating, 0) / completedAttempts.length
    : 0;

  return {
    skillsExplored: uniqueSkills.size,
    problemsCompleted: completedAttempts.length,
    totalTimeSpent: totalTime,
    recommendationsAvailable: recommendations.length,
    averageEnjoyment: Math.round(avgEnjoyment * 10) / 10 // Round to 1 decimal
  };
}

// Format time spent for display
export function formatTimeSpent(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

// Get suggested next skills based on what user hasn't tried yet
export interface SuggestedSkill {
  skill: Skill;
  reason: string;
}

export function getSuggestedSkills(userId: string = 'mock-user-1', limit: number = 3): SuggestedSkill[] {
  const attempts = getUserAttempts(userId);
  const triedSkillIds = new Set(attempts.map(a => a.skill_id));

  // Get skills user hasn't tried
  const untriedSkills = MOCK_SKILLS.filter(skill => !triedSkillIds.has(skill.id));

  // Get user's favorite categories (based on high enjoyment ratings)
  const favoriteCategories = new Set(
    attempts
      .filter(a => a.enjoyment_rating >= 4)
      .map(a => getSkillById(a.skill_id)?.category)
      .filter(Boolean) as string[]
  );

  // Prioritize skills in favorite categories
  const suggestions: SuggestedSkill[] = [];

  // First, add skills from favorite categories
  for (const skill of untriedSkills) {
    if (favoriteCategories.has(skill.category)) {
      suggestions.push({
        skill,
        reason: `You enjoyed ${skill.category.toLowerCase()} skills`
      });
      if (suggestions.length >= limit) break;
    }
  }

  // Fill remaining with random untried skills
  if (suggestions.length < limit) {
    const remaining = untriedSkills.filter(
      skill => !suggestions.some(s => s.skill.id === skill.id)
    );

    for (let i = 0; i < Math.min(remaining.length, limit - suggestions.length); i++) {
      suggestions.push({
        skill: remaining[i],
        reason: 'Explore something new'
      });
    }
  }

  return suggestions;
}

// Get top major recommendations with full details
export interface TopRecommendation {
  recommendation: MajorRecommendation;
  majorName: string;
  majorDescription: string;
  matchingSkillNames: string[];
}

export function getTopRecommendations(userId: string = 'mock-user-1', limit: number = 3): TopRecommendation[] {
  const recommendations = getUserRecommendations(userId);

  return recommendations.slice(0, limit).map(rec => {
    const major = getMajorById(rec.major_id);
    const skillNames = rec.matching_skills
      .map(skillId => getSkillById(skillId)?.name)
      .filter(Boolean) as string[];

    return {
      recommendation: rec,
      majorName: major?.name || 'Unknown Major',
      majorDescription: major?.description || '',
      matchingSkillNames: skillNames
    };
  });
}

// Get recent activity (last N attempts)
export interface RecentActivity {
  attempt: UserProblemAttempt;
  skillName: string;
  problemTitle: string;
  timeAgo: string;
}

export function getRecentActivity(userId: string = 'mock-user-1', limit: number = 5): RecentActivity[] {
  const attempts = getUserAttempts(userId);

  // Sort by created_at descending
  const sortedAttempts = [...attempts].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return sortedAttempts.slice(0, limit).map(attempt => {
    const skill = getSkillById(attempt.skill_id);

    return {
      attempt,
      skillName: skill?.name || 'Unknown Skill',
      problemTitle: `${skill?.name || 'Unknown'} Practice`,
      timeAgo: formatTimeAgo(attempt.created_at)
    };
  });
}

// Format time ago (simple version)
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return '1 day ago';
  } else {
    return `${diffDays} days ago`;
  }
}

// Check if user has enough data for recommendations
export function hasEnoughDataForRecommendations(userId: string = 'mock-user-1'): boolean {
  const attempts = getUserAttempts(userId);
  return attempts.filter(a => a.completed).length >= 3;
}

// Get encouragement message based on progress
export function getEncouragementMessage(userId: string = 'mock-user-1'): string {
  const stats = getDashboardStats(userId);

  if (stats.problemsCompleted === 0) {
    return "Ready to discover your path? Start by exploring a skill!";
  } else if (stats.problemsCompleted < 3) {
    const remaining = 3 - stats.problemsCompleted;
    return `Try ${remaining} more ${remaining === 1 ? 'skill' : 'skills'} to unlock personalized major recommendations!`;
  } else if (stats.problemsCompleted < 5) {
    return "Great progress! Keep exploring to refine your recommendations.";
  } else {
    return "You're building an amazing profile! Check out your recommendations.";
  }
}
