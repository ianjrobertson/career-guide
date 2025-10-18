'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LearningContainer } from './learning-container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { PracticeProblem, Skill } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

interface AIGeneratedLearningProps {
  problemId: string;
  userId: string;
}

export function AIGeneratedLearning({ problemId, userId }: AIGeneratedLearningProps) {
  const router = useRouter();
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the generated problem from sessionStorage
    const storedProblem = sessionStorage.getItem(`generated_problem_${problemId}`);
    
    console.log('Looking for problem with ID:', problemId);
    console.log('Raw sessionStorage data:', storedProblem);
    
    if (!storedProblem) {
      console.error('Problem not found in sessionStorage');
      // Problem not found, redirect to skills
      router.push('/protected/skills');
      return;
    }

    const loadProblemAndSkill = async () => {
      try {
        const parsedProblem = JSON.parse(storedProblem);
        console.log('Parsed problem:', parsedProblem);
        console.log('Problem title:', parsedProblem.title);
        console.log('Problem content:', parsedProblem.content);
        
        setProblem(parsedProblem);
        
        // Fetch skill data from Supabase
        const supabase = createClient();
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*')
          .eq('skill_id', parsedProblem.skill_id)
          .single();
        
        if (skillError || !skillData) {
          console.error('Failed to fetch skill:', skillError);
          // Fallback to basic skill object
          setSkill({
            id: parsedProblem.skill_id,
            name: 'Practice Skill',
            description: 'Practice this skill',
            category: 'General',
            major_ids: []
          });
        } else {
          // Use Supabase skill data
          setSkill({
            id: skillData.skill_id?.toString() || parsedProblem.skill_id,
            name: skillData.skill_name || 'Practice Skill',
            description: skillData.description || 'Practice this skill',
            category: skillData.category || 'General',
            major_ids: []
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to parse problem:', error);
        router.push('/protected/skills');
      }
    };

    loadProblemAndSkill();
  }, [problemId, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!problem || !skill) {
    return null;
  }

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
