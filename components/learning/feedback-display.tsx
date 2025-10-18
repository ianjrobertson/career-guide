import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { ProblemFeedback } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useRef } from 'react';

interface FeedbackDisplayProps {
  feedback: {
    feedback_text: string;
    strengths?: string[];
    improvements?: string[];
    accuracy_score?: number;
  };
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeConfetti, setFadeConfetti] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback.accuracy_score === 1) {
      setShowConfetti(true);
      setFadeConfetti(false);
      const fadeTimer = setTimeout(() => setFadeConfetti(true), 3500);
      const removeTimer = setTimeout(() => setShowConfetti(false), 4000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [feedback.accuracy_score]);

  return (
    <>
      {showConfetti && (
        <div
          ref={confettiRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            opacity: fadeConfetti ? 0 : 1,
            transition: 'opacity 0.5s ease',
            zIndex: 50
          }}
        >
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            gravity={0.3}
          />
        </div>
      )}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-primary" />
            <CardTitle className="text-lg">Feedback on Your Answer</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Feedback Text */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-base leading-relaxed">{feedback.feedback_text}</p>
          </div>

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                What you did well
              </h3>
              <div className="flex flex-wrap gap-2">
                {feedback.strengths.map((strength, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                Ways to enhance your thinking
              </h3>
              <ul className="space-y-1.5">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encouragement Note */}
          <div className="p-3 rounded-md bg-accent/50 border">
            <p className="text-sm text-muted-foreground italic">
              Remember: This is about discovering what you enjoy, not getting a perfect answer. Every attempt helps you learn more about your interests!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
