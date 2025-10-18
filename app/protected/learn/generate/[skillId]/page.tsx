import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSkillById } from '@/lib/mock-data';
import { GenerateProblemClient } from '@/components/learning/generate-problem-client';

interface GeneratePageProps {
  params: Promise<{
    skillId: string;
  }>;
}

export default async function GenerateProblemPage({ params }: GeneratePageProps) {
  const supabase = await createClient();

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const { skillId } = await params;

  // Fetch skill data
  const skill = getSkillById(skillId);

  if (!skill) {
    redirect('/protected/skills');
  }

  const userId = 'mock-user-1'; // In real app, get from auth

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GenerateProblemClient
        skillId={skill.id}
        skillName={skill.name}
        skillDescription={skill.description}
        userId={userId}
      />
    </div>
  );
}
