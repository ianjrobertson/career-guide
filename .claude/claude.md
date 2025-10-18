# Career Guide - First Year College Student Career Path Explorer

## Project Overview

This application helps first-year college students discover career paths through hands-on learning experiences. Students explore different skills by solving realistic practice problems, provide feedback on their enjoyment, and receive personalized major recommendations based on their preferences.

### Core Concept

Instead of traditional career quizzes, students learn by doing:
1. **Skill Selection** - Students choose skills they want to explore
2. **Practice Problem Generation** - AI generates relevant, hands-on problems for that skill
3. **Student Experience** - Students work through the problem
4. **Feedback Collection** - Students rate how much they enjoyed the experience
5. **Major Recommendations** - System suggests majors aligned with enjoyed skills

## Tech Stack

- **Frontend**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI/Workflows**: n8n for agentic workflows (practice problem generation, major matching)
- **Language**: TypeScript

## Project Structure

```
career-guide/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page (public)
│   ├── layout.tsx               # Root layout
│   ├── routes.md                # Route documentation
│   ├── auth/                    # Authentication pages (public)
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── confirm/
│   └── protected/               # ALL authenticated routes go here
│       ├── page.tsx             # Dashboard/home (main landing after login)
│       ├── layout.tsx           # Shared layout with navigation
│       ├── onboarding/          # New user setup
│       │   └── page.tsx
│       ├── skills/              # Skills browser (to be built)
│       │   └── page.tsx
│       ├── learn/               # Learning interface (to be built)
│       │   └── [problemId]/
│       │       └── page.tsx
│       ├── progress/            # Progress visualization (to be built)
│       │   └── page.tsx
│       ├── recommendations/     # Major recommendations (to be built)
│       │   └── page.tsx
│       └── profile/             # User profile (to be built)
│           └── page.tsx
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── onboarding/              # Onboarding flow components
│   │   ├── onboarding-form.tsx
│   │   ├── major-selector.tsx
│   │   └── skill-selector.tsx
│   ├── auth-button.tsx
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   └── [other components]
├── lib/                         # Utilities and services
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server-side client
│   │   └── middleware.ts       # Auth middleware
│   ├── mock-data.ts            # Mock data for development (majors, skills)
│   └── utils.ts                # Shared utilities
├── middleware.ts               # Next.js middleware (auth protection)
└── .env                        # Environment variables
```

## Database Schema (Supabase)

### Core Tables

**skills**
- `id` (uuid, primary key)
- `name` (text) - Skill name (e.g., "Data Analysis", "Creative Writing")
- `description` (text) - Skill description
- `category` (text) - Skill category
- `created_at` (timestamp)

**majors**
- `id` (uuid, primary key)
- `name` (text) - Major name
- `description` (text) - Major description
- `university` (text) - University offering the major
- `created_at` (timestamp)

**major_skills** (junction table)
- `id` (uuid, primary key)
- `major_id` (uuid, foreign key → majors)
- `skill_id` (uuid, foreign key → skills)
- `relevance_score` (int) - How relevant this skill is to the major (1-10)
- `created_at` (timestamp)

**practice_problems**
- `id` (uuid, primary key)
- `skill_id` (uuid, foreign key → skills)
- `title` (text)
- `description` (text)
- `difficulty` (text) - "beginner", "intermediate", "advanced"
- `content` (text) - Problem details/instructions
- `solution_hints` (jsonb) - Optional hints
- `generated_by_ai` (boolean)
- `created_at` (timestamp)

**user_problem_attempts**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → auth.users)
- `problem_id` (uuid, foreign key → practice_problems)
- `skill_id` (uuid, foreign key → skills)
- `enjoyment_rating` (int) - 1-5 scale
- `difficulty_rating` (int) - 1-5 scale
- `completed` (boolean)
- `time_spent_minutes` (int)
- `notes` (text) - Student's notes about the experience
- `created_at` (timestamp)

**user_major_recommendations**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → auth.users)
- `major_id` (uuid, foreign key → majors)
- `match_score` (float) - 0-100 based on enjoyed skills
- `recommended_at` (timestamp)
- `viewed` (boolean)
- `feedback` (text) - User feedback on recommendation

**user_profiles**
- `id` (uuid, primary key, foreign key → auth.users)
- `full_name` (text)
- `year` (text) - "freshman", "sophomore", etc.
- `current_major` (text) - Current declared major (if any)
- `interests` (text[]) - General interests
- `created_at` (timestamp)
- `updated_at` (timestamp)

## n8n Workflow Integration

### Workflow Endpoints (to be implemented)

**1. Generate Practice Problem**
- **Endpoint**: `/api/n8n/generate-problem`
- **Trigger**: Student selects a skill
- **Input**: `skill_id`, `difficulty_level`, `user_context`
- **Process**:
  - Retrieves skill details from Supabase
  - Calls AI model (Claude/GPT) to generate relevant problem
  - Validates problem quality
  - Stores in `practice_problems` table
- **Output**: Generated problem object

**2. Calculate Major Recommendations**
- **Endpoint**: `/api/n8n/recommend-majors`
- **Trigger**: After student completes problem and provides feedback
- **Input**: `user_id`, `recent_ratings`
- **Process**:
  - Analyzes user's enjoyment ratings
  - Queries `major_skills` to find majors matching enjoyed skills
  - Calculates weighted match scores
  - Considers skill relevance and enjoyment ratings
  - Stores recommendations in `user_major_recommendations`
- **Output**: List of recommended majors with match scores

**3. Personalize Problem Difficulty**
- **Endpoint**: `/api/n8n/adjust-difficulty`
- **Input**: `user_id`, `skill_id`, `past_attempts`
- **Process**: Analyzes past performance to suggest appropriate difficulty
- **Output**: Recommended difficulty level

### n8n Connection Setup

```typescript
// Example API call to n8n webhook
const generateProblem = async (skillId: string, userId: string) => {
  const response = await fetch(process.env.N8N_WEBHOOK_URL + '/generate-problem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY}`
    },
    body: JSON.stringify({
      skill_id: skillId,
      user_id: userId,
      difficulty: 'beginner'
    })
  });
  return response.json();
};
```

## Key Features to Implement

### 1. Learning Interface
- **Skills Browser** - Grid/list view of available skills with categories
- **Problem Viewer** - Display practice problem with clear instructions
- **Interactive Workspace** - Space for students to work on problems
- **Feedback Form** - Rating scales and text input for experience feedback

### 2. Recommendation Engine
- **Match Algorithm** - Calculate major fit based on enjoyed skills
- **Recommendation Dashboard** - Display suggested majors with explanations
- **Skill Mapping** - Show which skills align with each major
- **Exploration Path** - Suggest next skills to try based on current interests

### 3. Progress Tracking
- **Skills Tried** - Visual representation of explored skills
- **Enjoyment Heatmap** - Color-coded visualization of ratings
- **Time Investment** - Track time spent on different skill categories
- **Major Confidence** - Show how confidence in recommendations grows

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# n8n (to be added)
N8N_WEBHOOK_URL=your_n8n_instance_url
N8N_API_KEY=your_n8n_api_key

# AI Services (optional, if not using n8n)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

## Development Guidelines

### Component Organization
- Use **shadcn/ui** for base components (button, card, input, etc.)
- Create domain-specific components in `/components` root
- Keep components focused and composable
- Use TypeScript for all components with proper types

### State Management
- Use React hooks (useState, useEffect) for local state
- Supabase real-time subscriptions for live data
- Consider Zustand or Context API for global state if needed

### Supabase Patterns

**Client-side data fetching:**
```typescript
import { createBrowserClient } from '@/lib/supabase/client';

const supabase = createBrowserClient();
const { data, error } = await supabase
  .from('skills')
  .select('*')
  .order('name');
```

**Server-side data fetching:**
```typescript
import { createServerClient } from '@/lib/supabase/server';

const supabase = await createServerClient();
const { data, error } = await supabase
  .from('majors')
  .select('*, major_skills(skill_id, relevance_score)');
```

**Real-time subscriptions:**
```typescript
supabase
  .channel('recommendations')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'user_major_recommendations',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('New recommendation:', payload);
  })
  .subscribe();
```

### API Routes
- Use Next.js Route Handlers in `/app/api`
- Validate input with Zod or similar
- Handle errors gracefully with proper status codes
- Use server-side Supabase client for secure operations

### Styling
- Use Tailwind utility classes
- Follow shadcn/ui design patterns
- Maintain consistent spacing and color schemes
- Responsive design for mobile and desktop

## User Journey Flow

1. **Onboarding**
   - Student signs up / logs in
   - Completes brief profile (name, interests)
   - Sees introduction to the concept

2. **Skill Exploration**
   - Browse available skills by category
   - Select a skill to explore
   - System generates personalized practice problem (via n8n)

3. **Problem Solving**
   - Student works through the problem
   - Can request hints
   - Submits completion or skip

4. **Feedback Collection**
   - Rate enjoyment (1-5)
   - Rate difficulty (1-5)
   - Optional: Add notes about the experience

5. **Recommendation Update**
   - n8n workflow recalculates major matches
   - Updates recommendation dashboard
   - Suggests next skills to explore

6. **Major Discovery**
   - View recommended majors with match scores
   - See skill overlap between enjoyed activities and majors
   - Explore major details and requirements

## Testing Strategy

- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: API routes and database operations
- **E2E Tests**: Complete user journeys (Playwright)
- **Manual Testing**: Problem generation quality, recommendation accuracy

## Future Enhancements

- **Peer Comparison**: See how other students rated similar skills
- **Mentor Connections**: Connect with upperclassmen in recommended majors
- **Career Outcomes**: Show career paths for each major
- **Skill Progression**: Track skill improvement over time
- **Collaborative Problems**: Team-based challenges
- **Achievement System**: Badges for exploring different skill categories

## Notes for Claude

- This is a hackathon project - prioritize working features over perfection
- The n8n workflows are not yet implemented - API endpoints are placeholders
- Focus on creating an intuitive, engaging learning interface
- Problem generation is the critical feature - ensure it's realistic and relevant
- The recommendation algorithm should be transparent to build student trust
- Consider adding sample data for testing before n8n integration is complete

## Getting Started

1. **Install dependencies**: `npm install`
2. **Set up Supabase**: Create tables using schema above
3. **Configure environment**: Copy `.env.example` to `.env` and add keys
4. **Run dev server**: `npm run dev`
5. **Open browser**: Navigate to `http://localhost:3000`

## Questions to Consider

- How do we ensure generated problems are actually helpful?
- Should we limit the number of problems per skill?
- How do we handle students who rate everything the same?
- What's the minimum number of skills needed for good recommendations?
- Should recommendations update in real-time or after each problem?
