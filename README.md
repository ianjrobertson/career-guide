# Career Guide

A hands-on career exploration platform for first-year college students. Instead of traditional career quizzes, students discover majors by solving real practice problems and rating their experience.

## Overview

Career Guide helps students explore potential career paths through experiential learning:

- **Explore Skills** - Browse and select skills to try out
- **Solve Problems** - Work through AI-generated practice problems for each skill
- **Rate Experience** - Provide feedback on how much you enjoyed each activity
- **Discover Majors** - Receive personalized major recommendations based on your preferences

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Workflows**: n8n for practice problem generation and major matching

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- n8n instance (optional for MVP)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/career-guide.git
cd career-guide
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both values can be found in your [Supabase project's API settings](https://supabase.com/dashboard/project/_/settings/api).

4. Set up the database:
   - Create a new Supabase project at [database.new](https://database.new)
   - Run the SQL migrations in `/supabase/migrations` (if available)
   - Or manually create tables using the schema in `.claude/CLAUDE.md`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
career-guide/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   └── protected/         # Authenticated routes
│       ├── onboarding/    # New user setup
│       ├── skills/        # Skills browser
│       ├── learn/         # Learning interface
│       ├── progress/      # Progress & recommendations
│       └── profile/       # User profile
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── onboarding/       # Onboarding flow
├── lib/                  # Utilities & services
│   └── supabase/         # Supabase clients
└── middleware.ts         # Auth middleware
```

## Key Features

### Onboarding
New users complete a brief profile setup and introduction to the platform.

### Skill Exploration
Browse skills by category and select ones to explore through practice problems.

### Learning Interface
Work through AI-generated practice problems tailored to each skill.

### Feedback System
Rate your enjoyment and difficulty after completing each problem.

### Major Recommendations
View personalized major suggestions based on skills you enjoyed, with visual affinity charts showing which majors align with your interests.

## Database Schema

Core tables:
- `skills` - Available skills to explore
- `majors` - University majors with descriptions
- `major_skills` - Junction table linking majors to relevant skills
- `practice_problems` - AI-generated learning activities
- `user_problem_attempts` - Student feedback and ratings
- `user_major_recommendations` - Calculated major matches
- `user_profiles` - Student profile information

See `.claude/CLAUDE.md` for complete schema details.

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Style
- TypeScript for all code
- Tailwind CSS for styling
- shadcn/ui for UI components
- ESLint for linting

## Contributing

This is a hackathon project, but contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.

---

Built with Next.js, Supabase, and n8n
