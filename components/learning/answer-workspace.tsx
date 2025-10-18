'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface AnswerWorkspaceProps {
  answer: string;
  thoughts: string;
  onAnswerChange: (value: string) => void;
  onThoughtsChange: (value: string) => void;
  onSubmit: () => void;
  isGrading: boolean;
  isAnswerValid: boolean;
}

export function AnswerWorkspace({
  answer,
  thoughts,
  onAnswerChange,
  onThoughtsChange,
  onSubmit,
  isGrading,
  isAnswerValid
}: AnswerWorkspaceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Answer</CardTitle>
        <p className="text-sm text-muted-foreground">
          Take your time and explore your thinking. There's no single right answer!
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Answer Textarea */}
        <div className="space-y-2">
          <label htmlFor="answer" className="text-sm font-medium">
            Your response
          </label>
          <Textarea
            id="answer"
            placeholder="Type your answer here... Think through the problem and explain your reasoning."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="min-h-[200px] resize-y"
            disabled={isGrading}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{answer.length} characters</span>
            {!isAnswerValid && answer.length > 0 && (
              <span className="text-orange-500">
                Please write at least 10 characters
              </span>
            )}
          </div>
        </div>

        {/* Thoughts/Notes Textarea */}
        <div className="space-y-2">
          <label htmlFor="thoughts" className="text-sm font-medium">
            Your thoughts (optional)
          </label>
          <Textarea
            id="thoughts"
            placeholder="How did you approach this? What was challenging? Any other reflections?"
            value={thoughts}
            onChange={(e) => onThoughtsChange(e.target.value)}
            className="min-h-[100px] resize-y"
            disabled={isGrading}
          />
          <p className="text-xs text-muted-foreground">
            Share your thought process - this helps us understand your experience
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            onClick={onSubmit}
            disabled={!isAnswerValid || isGrading}
            size="lg"
            className="w-full"
          >
            {isGrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Feedback...
              </>
            ) : (
              'Get Feedback'
            )}
          </Button>
          {!isAnswerValid && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Write at least 10 characters to get feedback
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
