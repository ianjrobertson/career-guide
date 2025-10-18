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

  // Fetch skill data from Supabase
  const { data: skill, error: skillError } = await supabase
    .from('skills')
    .select('*')
    .eq('skill_id', skillId)
    .single();

  if (skillError || !skill) {
    redirect('/protected/skills');
  }

  const userId = 'mock-user-1'; // In real app, get from auth

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GenerateProblemClient
        skillId={skill.skill_id?.toString() || skillId}
        skillName={skill.skill_name || ''}
        skillDescription={skill.description || ''}
        userId={userId}
      />
    </div>
  );
}
