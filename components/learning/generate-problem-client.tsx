'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { generateAIPracticeProblem } from '@/lib/learning-helpers';

interface GenerateProblemClientProps {
  skillId: string;
  skillName: string;
  skillDescription: string;
  userId: string;
}

export function GenerateProblemClient({
  skillId,
  skillName,
  skillDescription,
  userId
}: GenerateProblemClientProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const [generatedProblem, setGeneratedProblem] = useState<PracticeProblem | null>(null);

  const handleGenerate = async (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setIsGenerating(true);
    setError(null);

    try {
      const problem = await generateAIPracticeProblem(
        skillId,
        skillName,
        skillDescription,
        difficulty,
        userId
      );

      //setGeneratedProblem(problem);
      
      // Store the generated problem in sessionStorage so it can be accessed by the learning page
      sessionStorage.setItem(`generated_problem_${problem.id}`, JSON.stringify(problem));
      
      // Redirect to the learning page with the generated problem
      router.push(`/protected/learn/${problem.id}`);
      
    } catch (err) {
      console.error('Failed to generate problem:', err);
      setError('Failed to generate a practice problem. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/protected/skills" className="gap-2">
            <ArrowLeft size={16} />
            Back to Skills
          </Link>
        </Button>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Generate Practice Problem</h1>
            <p className="text-muted-foreground text-lg">
              for <span className="font-semibold text-foreground">{skillName}</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              {skillDescription}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md w-full max-w-md">
              {error}
            </div>
          )}

          <div className="space-y-4 w-full max-w-md">
            <p className="text-sm font-medium text-center">Choose difficulty level:</p>

            <div className="grid gap-3">
              <Button
                onClick={() => handleGenerate('beginner')}
                disabled={isGenerating}
                size="lg"
                variant="outline"
                className="w-full justify-center text-center"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Beginner
              </Button>

              <Button
                onClick={() => handleGenerate('intermediate')}
                disabled={isGenerating}
                size="lg"
                variant="outline"
                className="w-full justify-center text-center"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Intermediate
              </Button>

              <Button
                onClick={() => handleGenerate('advanced')}
                disabled={isGenerating}
                size="lg"
                variant="outline"
                className="w-full justify-center text-center"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Advanced
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="text-sm text-muted-foreground">
              Generating your personalized practice problem...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
