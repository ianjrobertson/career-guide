import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LearningContainer } from '@/components/learning/learning-container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  getProblemById,
  getSkillById,
  MOCK_PRACTICE_PROBLEMS
} from '@/lib/mock-data';

interface LearnPageProps {
  params: Promise<{
    problemId: string;
  }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const supabase = await createClient();

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Await params (Next.js 15 requirement)
  const { problemId } = await params;

  // For now, if problemId looks like a skill ID (starts with 'skill-'),
  // redirect to the first problem for that skill
  // This handles clicks from the skills browser
  if (problemId.startsWith('skill-')) {
    const skillProblems = MOCK_PRACTICE_PROBLEMS.filter(
      (p) => p.skill_id === problemId
    );

    if (skillProblems.length > 0) {
      // Redirect to the first problem for this skill
      redirect(`/protected/learn/${skillProblems[0].id}`);
    } else {
      // No problems for this skill, redirect to skills browser
      redirect('/protected/skills');
    }
  }

  // Fetch problem data
  const problem = getProblemById(problemId);

  if (!problem) {
    notFound();
  }

  // Fetch skill data
  const skill = getSkillById(problem.skill_id);

  if (!skill) {
    notFound();
  }

  const userId = 'mock-user-1'; // In real app, get from auth

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/protected/skills" className="gap-2">
            <ArrowLeft size={16} />
            Back to Skills
          </Link>
        </Button>
      </div>

      {/* Main Learning Interface */}
      <LearningContainer problem={problem} skill={skill} userId={userId} />
    </div>
  );
}

// Generate static params for all problems (optional, for build optimization)
export async function generateStaticParams() {
  return MOCK_PRACTICE_PROBLEMS.map((problem) => ({
    problemId: problem.id
  }));
}
