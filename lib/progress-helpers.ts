import {
  getUserAttempts,
  getSkillById,
  MOCK_MAJORS,
  type UserProblemAttempt,
  type Major
} from './mock-data';

// Major distribution interface
export interface MajorDistribution {
  majorId: string;
  majorName: string;
  majorDescription: string;
  liked: number;
  disliked: number;
  total: number;
  affinityPercentage: number;
}

/**
 * Determine if a skill was liked based on enjoyment rating
 */
export function isSkillLiked(enjoymentRating: number): boolean {
  return enjoymentRating >= 4;
}

/**
 * Determine if a skill was disliked based on enjoyment rating
 */
export function isSkillDisliked(enjoymentRating: number): boolean {
  return enjoymentRating <= 2;
}

/**
 * Get major skill distribution based on user's attempts
 * Each skill can contribute to multiple majors
 */
export function getMajorSkillDistribution(userId: string = 'mock-user-1'): MajorDistribution[] {
  const attempts = getUserAttempts(userId);

  // Track counts per major
  const majorCounts = new Map<string, { liked: Set<string>; disliked: Set<string> }>();

  // Process each attempt
  attempts.forEach(attempt => {
    if (!attempt.completed) return;

    const skill = getSkillById(attempt.skill_id);
    if (!skill) return;

    const liked = isSkillLiked(attempt.enjoyment_rating);
    const disliked = isSkillDisliked(attempt.enjoyment_rating);

    // Skip neutral ratings (rating === 3)
    if (!liked && !disliked) return;

    // Add to each associated major
    skill.major_ids.forEach(majorId => {
      if (!majorCounts.has(majorId)) {
        majorCounts.set(majorId, {
          liked: new Set(),
          disliked: new Set()
        });
      }

      const counts = majorCounts.get(majorId)!;

      // Use Sets to ensure each skill is only counted once per major
      // (if user attempted same skill multiple times, count most recent rating)
      if (liked) {
        counts.liked.add(attempt.skill_id);
        counts.disliked.delete(attempt.skill_id); // Remove from disliked if it was there
      } else if (disliked) {
        counts.disliked.add(attempt.skill_id);
        counts.liked.delete(attempt.skill_id); // Remove from liked if it was there
      }
    });
  });

  // Convert to array and calculate totals
  const distributions: MajorDistribution[] = [];

  majorCounts.forEach((counts, majorId) => {
    const major = MOCK_MAJORS.find(m => m.id === majorId);
    if (!major) return;

    const liked = counts.liked.size;
    const disliked = counts.disliked.size;
    const total = liked + disliked;
    const affinityPercentage = total > 0 ? Math.round((liked / total) * 100) : 0;

    distributions.push({
      majorId: major.id,
      majorName: major.name,
      majorDescription: major.description,
      liked,
      disliked,
      total,
      affinityPercentage
    });
  });

  // Sort by total (most explored) then by affinity percentage
  return distributions.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    return b.affinityPercentage - a.affinityPercentage;
  });
}

/**
 * Get top N majors by affinity
 */
export function getTopMajorsByAffinity(
  userId: string = 'mock-user-1',
  limit: number = 8
): MajorDistribution[] {
  const distributions = getMajorSkillDistribution(userId);
  return distributions.slice(0, limit);
}

/**
 * Get the best matching major (highest affinity with at least 2 skills tried)
 */
export function getBestMatchingMajor(userId: string = 'mock-user-1'): MajorDistribution | null {
  const distributions = getMajorSkillDistribution(userId);

  // Filter to majors with at least 2 skills tried
  const qualified = distributions.filter(d => d.total >= 2);

  if (qualified.length === 0) return null;

  // Return the one with highest affinity percentage
  return qualified.sort((a, b) => b.affinityPercentage - a.affinityPercentage)[0];
}

/**
 * Generate insights based on progress data
 */
export function getProgressInsights(userId: string = 'mock-user-1'): string[] {
  const distributions = getMajorSkillDistribution(userId);
  const insights: string[] = [];

  if (distributions.length === 0) {
    return ['Complete some practice problems to discover which majors match your interests!'];
  }

  // Total majors explored
  insights.push(`You've explored skills in ${distributions.length} different major${distributions.length > 1 ? 's' : ''}`);

  // Best match
  const bestMatch = getBestMatchingMajor(userId);
  if (bestMatch) {
    if (bestMatch.affinityPercentage === 100) {
      insights.push(
        `${bestMatch.majorName} is a perfect match - you enjoyed all ${bestMatch.liked} related skill${bestMatch.liked > 1 ? 's' : ''} you tried!`
      );
    } else if (bestMatch.affinityPercentage >= 75) {
      insights.push(
        `${bestMatch.majorName} is a great match - you enjoyed ${bestMatch.liked} out of ${bestMatch.total} related skills!`
      );
    } else if (bestMatch.affinityPercentage >= 50) {
      insights.push(
        `${bestMatch.majorName} shows promise - you enjoyed ${bestMatch.liked} out of ${bestMatch.total} related skills`
      );
    }
  }

  // Multiple strong matches
  const strongMatches = distributions.filter(d => d.affinityPercentage >= 75 && d.total >= 2);
  if (strongMatches.length >= 2) {
    const majorNames = strongMatches.slice(0, 2).map(m => m.majorName).join(' and ');
    insights.push(`Both ${majorNames} are strong matches for you!`);
  }

  // Encouragement based on total attempts
  const totalSkillsTried = new Set(getUserAttempts(userId).map(a => a.skill_id)).size;
  if (totalSkillsTried < 3) {
    insights.push('Try more skills to refine your major recommendations');
  } else if (totalSkillsTried >= 5) {
    insights.push("You're building a strong profile - keep exploring!");
  }

  return insights;
}

/**
 * Get overview stats for progress page
 */
export interface ProgressOverviewStats {
  totalSkillsExplored: number;
  totalMajorsExplored: number;
  topMajorName: string | null;
  topMajorAffinity: number | null;
}

export function getProgressOverviewStats(userId: string = 'mock-user-1'): ProgressOverviewStats {
  const attempts = getUserAttempts(userId);
  const distributions = getMajorSkillDistribution(userId);

  const totalSkillsExplored = new Set(attempts.filter(a => a.completed).map(a => a.skill_id)).size;
  const totalMajorsExplored = distributions.length;

  const topMajor = distributions[0];

  return {
    totalSkillsExplored,
    totalMajorsExplored,
    topMajorName: topMajor?.majorName || null,
    topMajorAffinity: topMajor?.affinityPercentage || null
  };
}
