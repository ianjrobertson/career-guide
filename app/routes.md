# Career Guide - Application Routes

## Overview
This document outlines all routes in the Career Guide application, their purpose, key features, and data requirements.

---

## Public Routes

### `/` - Landing Page
**Status**:  Complete

**Purpose**: Marketing page to introduce the app and convert visitors to users

**Key Features**:
- Hero section with value proposition
- How it works (3-step process)
- Feature highlights
- Call-to-action for sign up

**User Flow**: Visitor � Sign Up or Sign In

---

### `/auth/*` - Authentication Pages
**Status**:  Complete (Supabase starter)

**Routes**:
- `/auth/login` - User login
- `/auth/sign-up` - New user registration
- `/auth/forgot-password` - Password reset
- `/auth/confirm` - Email confirmation

**User Flow**: Authentication � Redirect to onboarding (new users) or dashboard (returning users)

---

## Protected Routes (Requires Authentication)

### `/onboarding` - New User Onboarding
**Status**: � To Build

**Purpose**: Collect initial preferences to kickstart the experience

**Key Features**:
- **Step 1**: Welcome message + brief explanation
- **Step 2**: "What major are you considering?" (optional, can select multiple or skip)
- **Step 3**: "Pick 3-5 skills that sound interesting" (pre-filtered by selected majors if any)
- Progress indicator (step 1/2/3)
- Skip option for major selection
- Saves to `user_profiles` table

**Data Requirements**:
- Read: `majors`, `skills`, `major_skills` (to show relevant skills)
- Write: `user_profiles` (interests, current_major)

**User Flow**: Sign Up � Onboarding � Dashboard

**Design Notes**:
- Keep it lightweight (< 2 minutes)
- Make major selection optional to reduce friction
- Show skill previews with icons/badges

---

### `/dashboard` - Main Hub
**Status**: � To Build

**Purpose**: Central navigation point after login, shows overview of user's journey

**Key Features**:
- Welcome message with user's name
- Quick stats (skills explored, problems completed, recommendations available)
- "Continue Learning" section (suggested next skills)
- "Your Recommendations" preview (top 3 major matches)
- Recent activity feed
- Quick actions: Browse Skills, View Progress, See Recommendations

**Data Requirements**:
- Read: `user_profiles`, `user_problem_attempts`, `user_major_recommendations`, `skills`
- Aggregate: Count of completed problems, unique skills tried

**User Flow**: Login � Dashboard � Navigate to other sections

**Design Notes**:
- Card-based layout for different sections
- Prominent CTA for next action (explore new skill if < 3 attempted)
- Show progress encouragement ("Try 2 more skills to unlock recommendations!")

---

### `/skills` - Skills Browser
**Status**: � To Build

**Purpose**: Browse and discover available skills to explore

**Key Features**:
- Grid/card view of all skills
- Filter by category (Analytical, Creative, Technical, Social, etc.)
- Search functionality
- Show skill status: "Not Tried", "Tried", "Enjoyed" (based on ratings)
- Click skill � Start practice problem

**Data Requirements**:
- Read: `skills`, `user_problem_attempts` (to show status)
- Group by: `category`

**User Flow**: Dashboard/Nav � Skills Browser � Select Skill � Learning Interface

**Design Notes**:
- Visual cards with icons for each skill
- Color coding for status (gray=not tried, blue=tried, green=enjoyed)
- Category tabs or sidebar filter
- Skill difficulty indicator (beginner-friendly, intermediate, advanced)

---

### `/learn/[problemId]` - Learning Interface
**Status**: � To Build (CORE FEATURE)

**Purpose**: Interactive environment to practice a skill-based problem and provide feedback

**Key Features**:
- **Problem Display**:
  - Skill name and category badge
  - Problem title
  - Clear explanation/context
  - Question/task
  - Expected answer format
  - Optional hints (expandable)

- **Interactive Workspace**:
  - Text area for student's work/answer
  - Scratchpad/notes area
  - Timer (optional, tracks time spent)

- **Feedback Collection**:
  - "How much did you enjoy this?" (1-5 star rating)
  - "How difficult was this?" (1-5 scale: Too Easy � Too Hard)
  - Optional text: "What did you like or dislike?"
  - "Try Another Skill" or "See Recommendations" buttons

**Data Requirements**:
- Read: `practice_problems` (by ID), `skills`
- Write: `user_problem_attempts` (ratings, completion, time_spent, notes)
- Trigger: n8n recommendation update workflow

**User Flow**:
1. Select skill from Skills Browser
2. n8n generates problem � Redirect to `/learn/[problemId]`
3. Student works through problem
4. Submit feedback
5. Option to continue or view recommendations

**Design Notes**:
- Clean, distraction-free interface
- Save draft functionality (auto-save notes)
- Clear visual separation between problem and workspace
- Friendly, encouraging copy
- No "correct answer" validation (focus on enjoyment, not performance)

**JSON Structure** (from n8n):
```json
{
  "id": "uuid",
  "skill_id": "uuid",
  "skill_name": "Data Analysis",
  "title": "Analyzing Customer Survey Data",
  "explanation": "You work for a coffee shop...",
  "question": "Based on this data, what would you recommend?",
  "hints": ["Consider the age groups", "Look for patterns"],
  "difficulty": "beginner"
}
```

---

### `/progress` - Results & Progress Page
**Status**: � To Build (CORE FEATURE)

**Purpose**: Visualize skills explored and how the student rated them

**Key Features**:
- **Overview Stats**:
  - Total skills explored
  - Total time spent learning
  - Favorite skill (highest rated)

- **Skills Heatmap/Grid**:
  - Visual grid showing all skills
  - Color-coded by enjoyment rating (1=red, 5=green gradient)
  - Hover for details (rating, time spent, date)

- **Category Breakdown**:
  - Chart/graph showing enjoyment by category
  - "You loved Analytical skills!" insights

- **Timeline/History**:
  - Chronological list of problems attempted
  - Rating and brief notes for each

**Data Requirements**:
- Read: `user_problem_attempts`, `skills`, `practice_problems`
- Aggregate: Average rating by category, total time, counts

**User Flow**: Dashboard/Nav � Progress � View insights � Return to browse skills

**Design Notes**:
- Heavy use of data visualization (charts, heatmaps)
- Encouraging messaging ("You're building a strong profile!")
- Export or share progress (future feature)
- Responsive grid layout

## Additional Suggested Routes

### `/profile` - User Profile & Settings
**Status**: � To Build

**Purpose**: Manage user information and preferences

**Key Features**:
- Edit profile (name, year, interests)
- Update current major
- Account settings (email, password)
- Preferences (difficulty level, notification settings)
- Sign out

**Data Requirements**:
- Read/Write: `user_profiles`, `auth.users`

---

### `/skills/[skillId]` - Skill Detail Page
**Status**: > Optional (Nice to Have)

**Purpose**: Detailed information about a specific skill

**Key Features**:
- Skill description
- Related majors that use this skill
- Sample problem preview
- "Start Practice" button
- Related skills

**Data Requirements**:
- Read: `skills`, `major_skills`, `majors`

**User Flow**: Skills Browser � Skill Detail � Start Learning

---

### `/majors/[majorId]` - Major Information Page
**Status**: > Optional (Nice to Have)

**Purpose**: Detailed information about a major

**Key Features**:
- Major description
- Required/recommended skills
- Career outcomes
- Universities offering this major
- "Explore Skills for This Major" button

**Data Requirements**:
- Read: `majors`, `major_skills`, `skills`

**User Flow**: Recommendations � Major Detail � Explore related skills

---

## Route Priority for Development

### Phase 1 - MVP (Essential)
1.  `/` - Landing (Complete)
2.  `/auth/*` - Authentication (Complete)
3. `/onboarding` - New user setup
4. `/dashboard` - Main hub
5. `/skills` - Browse skills
6. `/learn/[problemId]` - **CORE** - Learning interface
7. `/progress` - **CORE** - Visual results
8. `/recommendations` - **CORE** - Major matches

### Phase 2 - Enhancement
9. `/profile` - User settings
10. `/skills/[skillId]` - Skill details
11. `/majors/[majorId]` - Major details

---

## Navigation Structure

**Main Navigation** (shown when authenticated):
- Dashboard (home icon)
- Browse Skills
- My Progress
- Recommendations
- Profile (avatar dropdown)

**Mobile**: Bottom navigation bar
**Desktop**: Top navigation bar + sidebar (optional)

---

## Protected Route Logic

All routes except `/` and `/auth/*` require authentication.

**Middleware checks** (`middleware.ts`):
1. User authenticated? � Allow access
2. Not authenticated? � Redirect to `/auth/login`
3. Authenticated but no profile? � Redirect to `/onboarding`
4. Onboarding complete? � Allow full app access

---

## Notes for Implementation

- Use Next.js App Router conventions (`app/` directory)
- Server Components for data fetching where possible
- Client Components for interactivity (forms, ratings)
- Use Supabase client-side for real-time updates
- Use Supabase server-side for initial data loading
- Implement proper loading states (`loading.tsx`)
- Implement proper error handling (`error.tsx`)
- Use route groups for organization: `(auth)`, `(protected)`, etc.

---

## API Routes Needed

- `/api/n8n/generate-problem` - Trigger problem generation
- `/api/n8n/recommend-majors` - Trigger recommendation calculation
- `/api/problems/submit-feedback` - Save problem attempt and feedback
- `/api/profile/update` - Update user profile
- `/api/onboarding/complete` - Mark onboarding as complete
