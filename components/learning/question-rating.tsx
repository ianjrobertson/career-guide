'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ArrowRight, Sparkles } from 'lucide-react';

interface QuestionRatingProps {
  onSubmitRating: (liked: boolean) => void;
  isCompleted: boolean;
  encouragementMessage?: string;
}

export function QuestionRating({
  onSubmitRating,
  isCompleted,
  encouragementMessage
}: QuestionRatingProps) {
  const [selectedRating, setSelectedRating] = useState<boolean | null>(null);

  const handleRatingClick = (liked: boolean) => {
    setSelectedRating(liked);
    onSubmitRating(liked);
  };

  if (isCompleted) {
    return (
      <Card className="border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Sparkles size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {encouragementMessage || 'Thanks for your feedback!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Your response has been recorded. Keep exploring to build your profile!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" variant="default">
                <Link href="/protected/skills" className="gap-2">
                  Try Another Skill
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/protected/recommendations">
                  View Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">What did you think?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Did you enjoy working on this problem?
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant={selectedRating === true ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleRatingClick(true)}
            className="flex-1 h-24 flex-col gap-2"
          >
            <ThumbsUp size={32} />
            <span className="text-lg font-semibold">Yes, I enjoyed it!</span>
          </Button>

          <Button
            variant={selectedRating === false ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleRatingClick(false)}
            className="flex-1 h-24 flex-col gap-2"
          >
            <ThumbsDown size={32} />
            <span className="text-lg font-semibold">Not for me</span>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Your honest feedback helps us recommend majors that match your interests
        </p>
      </CardContent>
    </Card>
  );
}
