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
