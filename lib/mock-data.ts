// Mock data for onboarding - will be replaced with real Supabase queries later

export interface Major {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  major_ids: string[]; // Which majors this skill belongs to
}

// Mock majors data
export const MOCK_MAJORS: Major[] = [
  {
    id: "major-1",
    name: "Computer Science",
    description: "Design and build software systems, work with algorithms and data structures",
    category: "Technology"
  },
  {
    id: "major-2",
    name: "Business Administration",
    description: "Learn to manage organizations, analyze markets, and make strategic decisions",
    category: "Business"
  },
  {
    id: "major-3",
    name: "Psychology",
    description: "Study human behavior, mental processes, and therapeutic techniques",
    category: "Social Sciences"
  },
  {
    id: "major-4",
    name: "Mechanical Engineering",
    description: "Design and build mechanical systems, from engines to robots",
    category: "Engineering"
  },
  {
    id: "major-5",
    name: "English Literature",
    description: "Analyze texts, develop critical thinking, and master written communication",
    category: "Humanities"
  },
  {
    id: "major-6",
    name: "Biology",
    description: "Study living organisms, from cells to ecosystems",
    category: "Natural Sciences"
  },
  {
    id: "major-7",
    name: "Graphic Design",
    description: "Create visual content for digital and print media",
    category: "Arts & Design"
  },
  {
    id: "major-8",
    name: "Economics",
    description: "Analyze markets, financial systems, and economic policy",
    category: "Social Sciences"
  }
];

// Mock skills data
export const MOCK_SKILLS: Skill[] = [
  // Computer Science skills
  {
    id: "skill-1",
    name: "Problem Solving",
    description: "Break down complex problems into manageable steps",
    category: "Analytical",
    major_ids: ["major-1", "major-4", "major-8"]
  },
  {
    id: "skill-2",
    name: "Programming Logic",
    description: "Think through algorithms and code structure",
    category: "Technical",
    major_ids: ["major-1"]
  },
  {
    id: "skill-3",
    name: "Data Analysis",
    description: "Extract insights from datasets and identify patterns",
    category: "Analytical",
    major_ids: ["major-1", "major-2", "major-6", "major-8"]
  },
  {
    id: "skill-4",
    name: "System Design",
    description: "Plan and architect complex software systems",
    category: "Technical",
    major_ids: ["major-1", "major-4"]
  },

  // Business Administration skills
  {
    id: "skill-5",
    name: "Strategic Thinking",
    description: "Develop long-term plans and competitive strategies",
    category: "Analytical",
    major_ids: ["major-2", "major-8"]
  },
  {
    id: "skill-6",
    name: "Financial Analysis",
    description: "Interpret financial statements and make investment decisions",
    category: "Analytical",
    major_ids: ["major-2", "major-8"]
  },
  {
    id: "skill-7",
    name: "Leadership",
    description: "Guide teams and make difficult decisions",
    category: "Social",
    major_ids: ["major-2", "major-3"]
  },
  {
    id: "skill-8",
    name: "Marketing Strategy",
    description: "Understand consumer behavior and create campaigns",
    category: "Creative",
    major_ids: ["major-2", "major-7"]
  },

  // Psychology skills
  {
    id: "skill-9",
    name: "Empathy & Active Listening",
    description: "Understand others' perspectives and emotions",
    category: "Social",
    major_ids: ["major-3"]
  },
  {
    id: "skill-10",
    name: "Research Design",
    description: "Plan and execute scientific studies",
    category: "Analytical",
    major_ids: ["major-3", "major-6"]
  },
  {
    id: "skill-11",
    name: "Behavioral Analysis",
    description: "Observe and interpret human behavior patterns",
    category: "Analytical",
    major_ids: ["major-3"]
  },

  // Mechanical Engineering skills
  {
    id: "skill-12",
    name: "Spatial Reasoning",
    description: "Visualize 3D objects and how they move",
    category: "Technical",
    major_ids: ["major-4", "major-7"]
  },
  {
    id: "skill-13",
    name: "Physics Application",
    description: "Apply physical principles to real-world problems",
    category: "Technical",
    major_ids: ["major-4"]
  },
  {
    id: "skill-14",
    name: "Prototyping",
    description: "Build and test physical models",
    category: "Technical",
    major_ids: ["major-4", "major-7"]
  },

  // English Literature skills
  {
    id: "skill-15",
    name: "Critical Analysis",
    description: "Interpret texts and identify deeper meanings",
    category: "Analytical",
    major_ids: ["major-5"]
  },
  {
    id: "skill-16",
    name: "Creative Writing",
    description: "Craft compelling narratives and prose",
    category: "Creative",
    major_ids: ["major-5", "major-7"]
  },
  {
    id: "skill-17",
    name: "Persuasive Communication",
    description: "Articulate ideas clearly and convince others",
    category: "Social",
    major_ids: ["major-5", "major-2"]
  },

  // Biology skills
  {
    id: "skill-18",
    name: "Scientific Method",
    description: "Form hypotheses and design experiments",
    category: "Analytical",
    major_ids: ["major-6"]
  },
  {
    id: "skill-19",
    name: "Lab Techniques",
    description: "Perform precise measurements and procedures",
    category: "Technical",
    major_ids: ["major-6"]
  },
  {
    id: "skill-20",
    name: "Pattern Recognition",
    description: "Identify trends in biological systems",
    category: "Analytical",
    major_ids: ["major-6", "major-3"]
  },

  // Graphic Design skills
  {
    id: "skill-21",
    name: "Visual Composition",
    description: "Arrange elements to create appealing designs",
    category: "Creative",
    major_ids: ["major-7"]
  },
  {
    id: "skill-22",
    name: "Color Theory",
    description: "Use color to evoke emotions and communicate",
    category: "Creative",
    major_ids: ["major-7"]
  },
  {
    id: "skill-23",
    name: "User Experience Design",
    description: "Create intuitive, user-friendly interfaces",
    category: "Technical",
    major_ids: ["major-7", "major-1"]
  },

  // Economics skills
  {
    id: "skill-24",
    name: "Statistical Modeling",
    description: "Build models to predict economic trends",
    category: "Analytical",
    major_ids: ["major-8"]
  },
  {
    id: "skill-25",
    name: "Policy Analysis",
    description: "Evaluate the impact of government policies",
    category: "Analytical",
    major_ids: ["major-8"]
  }
];

// Helper function to get skills by major ID
export function getSkillsByMajorId(majorId: string): Skill[] {
  return MOCK_SKILLS.filter(skill => skill.major_ids.includes(majorId));
}

// Helper function to get major by ID
export function getMajorById(majorId: string): Major | undefined {
  return MOCK_MAJORS.find(major => major.id === majorId);
}

// Mock function to simulate saving onboarding data
export interface OnboardingData {
  majorId: string;
  skillIds: string[];
  completedAt: string;
}

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_onboarding_data', JSON.stringify(data));
  }
}

export function getOnboardingData(): OnboardingData | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('user_onboarding_data');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function hasCompletedOnboarding(): boolean {
  return getOnboardingData() !== null;
}

// Practice Problems Mock Data
export interface PracticeProblem {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  solution_hints: string[];
  generated_by_ai: boolean;
  created_at: string;
}

export const MOCK_PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'problem-1',
    skill_id: 'skill-3',
    title: 'Analyzing Coffee Shop Survey Data',
    description: 'Work with customer feedback data to make business recommendations',
    difficulty: 'beginner',
    content: 'You work for a coffee shop chain. Review this customer survey data and identify which age group is most satisfied and what improvements to prioritize.',
    solution_hints: ['Look for patterns in age groups', 'Consider satisfaction ratings'],
    generated_by_ai: true,
    created_at: '2025-10-15T10:00:00Z'
  },
  {
    id: 'problem-2',
    skill_id: 'skill-16',
    title: 'Writing a Character Backstory',
    description: 'Create a compelling character with depth and motivation',
    difficulty: 'beginner',
    content: 'Write a 200-word backstory for a character who just discovered they have an unusual ability. Focus on their emotional journey.',
    solution_hints: ['Start with a key moment', 'Show emotion through actions'],
    generated_by_ai: true,
    created_at: '2025-10-14T14:30:00Z'
  },
  {
    id: 'problem-3',
    skill_id: 'skill-1',
    title: 'Optimizing a Campus Route',
    description: 'Find the most efficient path between classes',
    difficulty: 'beginner',
    content: 'You have 4 classes across campus with 10-minute breaks. Plan the optimal route considering walking time, building locations, and break times.',
    solution_hints: ['Map out the locations', 'Consider time constraints'],
    generated_by_ai: true,
    created_at: '2025-10-13T09:15:00Z'
  },
  {
    id: 'problem-4',
    skill_id: 'skill-21',
    title: 'Designing a Student Event Poster',
    description: 'Create a visual layout for a campus event',
    difficulty: 'beginner',
    content: 'Design a poster layout for a fall festival. Consider hierarchy, color scheme, and how to make key information (date, time, location) stand out.',
    solution_hints: ['Think about visual hierarchy', 'Use contrast for important details'],
    generated_by_ai: true,
    created_at: '2025-10-12T16:45:00Z'
  },
  {
    id: 'problem-5',
    skill_id: 'skill-5',
    title: 'Campus Club Growth Strategy',
    description: 'Develop a plan to grow a student organization',
    difficulty: 'beginner',
    content: 'Your club has 15 members. Create a 3-month strategy to double membership while maintaining engagement.',
    solution_hints: ['Consider different outreach channels', 'Think about retention'],
    generated_by_ai: true,
    created_at: '2025-10-11T11:20:00Z'
  }
];

// User Problem Attempts Mock Data
export interface UserProblemAttempt {
  id: string;
  user_id: string;
  problem_id: string;
  skill_id: string;
  enjoyment_rating: number; // 1-5
  difficulty_rating: number; // 1-5
  completed: boolean;
  time_spent_minutes: number;
  notes: string;
  created_at: string;
}

export const MOCK_USER_ATTEMPTS: UserProblemAttempt[] = [
  {
    id: 'attempt-1',
    user_id: 'mock-user-1',
    problem_id: 'problem-3',
    skill_id: 'skill-1',
    enjoyment_rating: 5,
    difficulty_rating: 2,
    completed: true,
    time_spent_minutes: 25,
    notes: 'This was fun! I loved figuring out the most efficient route.',
    created_at: '2025-10-13T10:00:00Z'
  },
  {
    id: 'attempt-2',
    user_id: 'mock-user-1',
    problem_id: 'problem-2',
    skill_id: 'skill-16',
    enjoyment_rating: 4,
    difficulty_rating: 3,
    completed: true,
    time_spent_minutes: 35,
    notes: 'Creative writing is harder than I thought, but I enjoyed it.',
    created_at: '2025-10-14T15:00:00Z'
  },
  {
    id: 'attempt-3',
    user_id: 'mock-user-1',
    problem_id: 'problem-1',
    skill_id: 'skill-3',
    enjoyment_rating: 5,
    difficulty_rating: 2,
    completed: true,
    time_spent_minutes: 30,
    notes: 'I really enjoyed working with data and finding patterns!',
    created_at: '2025-10-15T11:00:00Z'
  },
  {
    id: 'attempt-4',
    user_id: 'mock-user-1',
    problem_id: 'problem-4',
    skill_id: 'skill-21',
    enjoyment_rating: 3,
    difficulty_rating: 4,
    completed: true,
    time_spent_minutes: 40,
    notes: 'Design is interesting but challenging for me.',
    created_at: '2025-10-12T17:30:00Z'
  }
];

// Major Recommendations Mock Data
export interface MajorRecommendation {
  id: string;
  user_id: string;
  major_id: string;
  match_score: number; // 0-100
  recommended_at: string;
  viewed: boolean;
  matching_skills: string[]; // skill IDs that contributed to the match
}

export const MOCK_RECOMMENDATIONS: MajorRecommendation[] = [
  {
    id: 'rec-1',
    user_id: 'mock-user-1',
    major_id: 'major-1', // Computer Science
    match_score: 92,
    recommended_at: '2025-10-15T12:00:00Z',
    viewed: false,
    matching_skills: ['skill-1', 'skill-3']
  },
  {
    id: 'rec-2',
    user_id: 'mock-user-1',
    major_id: 'major-8', // Economics
    match_score: 85,
    recommended_at: '2025-10-15T12:00:00Z',
    viewed: false,
    matching_skills: ['skill-1', 'skill-3']
  },
  {
    id: 'rec-3',
    user_id: 'mock-user-1',
    major_id: 'major-2', // Business Administration
    match_score: 78,
    recommended_at: '2025-10-15T12:00:00Z',
    viewed: false,
    matching_skills: ['skill-3']
  },
  {
    id: 'rec-4',
    user_id: 'mock-user-1',
    major_id: 'major-5', // English Literature
    match_score: 72,
    recommended_at: '2025-10-15T12:00:00Z',
    viewed: false,
    matching_skills: ['skill-16']
  }
];

// User Profile Mock Data
export interface UserProfile {
  id: string;
  full_name: string;
  university: string;
  year: string;
  current_major: string | null;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'mock-user-1',
  full_name: 'Alex Johnson',
  university: 'State University',
  year: 'freshman',
  current_major: null,
  interests: ['technology', 'problem-solving', 'creative writing'],
  created_at: '2025-10-10T08:00:00Z',
  updated_at: '2025-10-15T12:00:00Z'
};

// Helper functions for mock data
export function getProblemById(problemId: string): PracticeProblem | undefined {
  return MOCK_PRACTICE_PROBLEMS.find(p => p.id === problemId);
}

export function getSkillById(skillId: string): Skill | undefined {
  return MOCK_SKILLS.find(s => s.id === skillId);
}

export function getUserAttempts(userId: string = 'mock-user-1'): UserProblemAttempt[] {
  return MOCK_USER_ATTEMPTS.filter(a => a.user_id === userId);
}

export function getUserRecommendations(userId: string = 'mock-user-1'): MajorRecommendation[] {
  return MOCK_RECOMMENDATIONS.filter(r => r.user_id === userId)
    .sort((a, b) => b.match_score - a.match_score);
}

// Get all unique skill categories
export function getSkillCategories(): string[] {
  const categories = new Set(MOCK_SKILLS.map(skill => skill.category));
  return Array.from(categories).sort();
}

// Get majors that include a specific skill
export function getMajorsBySkillId(skillId: string): Major[] {
  const skill = getSkillById(skillId);
  if (!skill) return [];

  return skill.major_ids
    .map(majorId => getMajorById(majorId))
    .filter(Boolean) as Major[];
}

// Save user profile updates (mock implementation)
export function saveUserProfile(updates: Partial<UserProfile>): void {
  if (typeof window === 'undefined') return;

  const currentProfile = MOCK_USER_PROFILE;
  const updatedProfile = {
    ...currentProfile,
    ...updates,
    updated_at: new Date().toISOString()
  };

  // Save to localStorage for persistence in demo
  localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
}

// Get user profile (with localStorage override)
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return MOCK_USER_PROFILE;

  const stored = localStorage.getItem('user_profile');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_USER_PROFILE;
    }
  }

  return MOCK_USER_PROFILE;
}

// AI Feedback for Problem Grading
export interface ProblemFeedback {
  id: string;
  problem_id: string;
  user_answer: string;
  feedback_text: string;
  strengths: string[];
  improvements: string[];
  generated_at: string;
}

// Mock function to simulate AI grading - will be replaced with actual AI call
export function generateMockFeedback(
  problemId: string,
  userAnswer: string,
  skillId: string
): ProblemFeedback {
  const skill = getSkillById(skillId);
  const answerLength = userAnswer.trim().length;

  // Generate feedback based on answer quality (length as proxy)
  let feedbackText = '';
  let strengths: string[] = [];
  let improvements: string[] = [];

  if (answerLength > 200) {
    feedbackText = `Great work! You provided a thorough and well-thought-out response. Your answer demonstrates strong understanding of ${skill?.name || 'this skill'}.`;
    strengths = [
      'Detailed explanation',
      'Clear reasoning',
      'Good use of examples'
    ];
    improvements = [
      'Consider organizing your thoughts with bullet points for clarity'
    ];
  } else if (answerLength > 100) {
    feedbackText = `Good effort! You covered the key points and showed solid thinking around ${skill?.name || 'this skill'}. Your answer is on the right track.`;
    strengths = [
      'Addressed the main question',
      'Logical approach'
    ];
    improvements = [
      'Try adding more specific examples',
      'Consider exploring alternative perspectives'
    ];
  } else if (answerLength > 30) {
    feedbackText = `Nice start! You've identified some important points about ${skill?.name || 'this skill'}. With a bit more depth, this could be even stronger.`;
    strengths = [
      'Concise response',
      'Got the basics right'
    ];
    improvements = [
      'Expand on your reasoning',
      'Add more details to support your answer',
      'Consider what-if scenarios'
    ];
  } else {
    feedbackText = `Thanks for giving it a try! ${skill?.name || 'This skill'} can be challenging. Don't worry about getting it perfect - the goal is to explore and learn what you enjoy.`;
    strengths = [
      'You engaged with the problem',
      'Every attempt is valuable learning'
    ];
    improvements = [
      'Try elaborating on your initial thoughts',
      'Take your time to explore different angles'
    ];
  }

  return {
    id: `feedback-${Date.now()}`,
    problem_id: problemId,
    user_answer: userAnswer,
    feedback_text: feedbackText,
    strengths,
    improvements,
    generated_at: new Date().toISOString()
  };
}
