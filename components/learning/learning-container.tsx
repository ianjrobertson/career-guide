'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProblemDisplay } from './problem-display';
import { AnswerWorkspace } from './answer-workspace';
import { FeedbackDisplay } from './feedback-display';
import { QuestionRating } from './question-rating';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { PracticeProblem, Skill, ProblemFeedback } from '@/lib/mock-data';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  calculateTimeSpent,
  formatElapsedTime,
  getEncouragementMessage,
  saveProblemAttempt,
  isAnswerValid as checkAnswerValid,
  type LearningState
} from '@/lib/learning-helpers';
import { getFeedbackFromWebhook } from '@/lib/learning-helpers';
import { addAssessmentQuestionScore } from '@/lib/supabase/assessment';

interface LearningContainerProps {
  problem: PracticeProblem;
  skill: Skill;
  userId: string;
}

export function LearningContainer({ problem, skill, userId }: LearningContainerProps) {
  // State management
  const [state, setState] = useState<LearningState>('answering');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<ProblemFeedback | null>(null);
  const [encouragement, setEncouragement] = useState('');
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('0s');

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft(problem.id);
    if (draft) {
      setAnswer(draft.answer);
    }
  }, [problem.id]);

  // Auto-save draft
  useEffect(() => {
    if (state === 'answering' && answer) {
      const timer = setTimeout(() => {
        saveDraft(problem.id, answer, '');
      }, 1000); // Debounce 1 second

      return () => clearTimeout(timer);
    }
  }, [answer, problem.id, state]);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle submit for feedback
  const handleSubmitForFeedback = useCallback(async () => {
    if (!checkAnswerValid(answer)) return;
    setState('grading');
    try {
      const feedbackData = await getFeedbackFromWebhook(problem, answer, skill.id);
      setFeedback(feedbackData as any); // Accept the feedback as-is for display

      // Add to assessment_questions_score table in Supabase
      try {
        await addAssessmentQuestionScore({
          // Only pass accuracy_score_0to1 if present
          ...(typeof (feedbackData as any).accuracy_score === 'number' && { accuracy_score_0to1: (feedbackData as any).accuracy_score }),
          // assessment_id: undefined, // If you have an assessment_id, pass it here
          feedback: feedbackData.feedback_text,
          question: problem.content,
          skill_id: skill.id ? Number(skill.id) : null,
        });
      } catch (dbError) {
        console.error('Error saving assessment question score:', dbError);
      }

      setState('graded');
    } catch (error) {
      console.error('Error getting feedback:', error);
      setState('answering');
    }
  }, [answer, problem, skill.id]);

  // Handle rating submission
  const handleSubmitRating = useCallback(
    async (liked: boolean) => {
      const timeSpent = calculateTimeSpent(startTime);
      const encouragementMsg = getEncouragementMessage(liked);

      // Update the assessment with user's rating
      try {
        await addAssessmentQuestionScore({
          skill_id: skill.id ? Number(skill.id) : null,
          user_liked: liked,
        });
      } catch (dbError) {
        console.error('Error updating assessment with user rating:', dbError);
      }

      // Save attempt
      saveProblemAttempt({
        userId,
        problemId: problem.id,
        skillId: skill.id,
        userAnswer: answer,
        thoughts: '',
        liked,
        timeSpentMinutes: timeSpent
      });

      // Clear draft
      clearDraft(problem.id);

      // Update state
      setEncouragement(encouragementMsg);
      setState('completed');
    },
    [startTime, userId, problem, skill.id, answer]
  );

  return (
    <div className="space-y-6">
      {/* Timer and Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>Time: {elapsedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={state === 'answering' ? 'default' : 'secondary'}>
            1. Answer
          </Badge>
          <Badge variant={state === 'graded' ? 'default' : 'secondary'}>
            2. Feedback
          </Badge>
          <Badge variant={state === 'completed' ? 'default' : 'secondary'}>
            3. Rate
          </Badge>
        </div>
      </div>

      {/* Problem Display (Always visible) */}
      <ProblemDisplay problem={problem} skill={skill} />

      {/* Answering Phase */}
      {(state === 'answering' || state === 'grading') && (
        <AnswerWorkspace
          answer={answer}
          onAnswerChange={setAnswer}
          onSubmit={handleSubmitForFeedback}
          isGrading={state === 'grading'}
          isAnswerValid={checkAnswerValid(answer)}
        />
      )}

      {/* Graded Phase - Show Feedback */}
      {(state === 'graded' || state === 'completed') && feedback && (
        <>
          <FeedbackDisplay feedback={feedback} />

          {/* Show user's answer for reference */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <h3 className="font-semibold text-sm mb-2">Your Answer:</h3>
            <p className="text-sm whitespace-pre-wrap">{answer}</p>
          </div>
        </>
      )}

      {/* Rating Phase */}
      {(state === 'graded' || state === 'completed') && (
        <QuestionRating
          onSubmitRating={handleSubmitRating}
          isCompleted={state === 'completed'}
          encouragementMessage={encouragement}
        />
      )}
    </div>
  );
}
