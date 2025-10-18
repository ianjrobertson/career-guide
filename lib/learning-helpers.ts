import {generateMockFeedback, type ProblemFeedback} from './mock-data';
import type {PracticeProblem} from './mock-data';

// Learning state types
export type LearningState = 'answering'|'grading'|'graded'|'completed';

// Draft storage key
const DRAFT_STORAGE_KEY = 'learning_draft_';

/**
 * Save draft answer to localStorage
 */
export function saveDraft(
    problemId: string, answer: string, thoughts: string): void {
  if (typeof window === 'undefined') return;

  const draft = {answer, thoughts, savedAt: new Date().toISOString()};

  localStorage.setItem(
      `${DRAFT_STORAGE_KEY}${problemId}`, JSON.stringify(draft));
}

/**
 * Load draft answer from localStorage
 */
export function loadDraft(problemId: string):
    {answer: string; thoughts: string}|null {
  if (typeof window === 'undefined') return null;

  const draftStr = localStorage.getItem(`${DRAFT_STORAGE_KEY}${problemId}`);
  if (!draftStr) return null;

  try {
    const draft = JSON.parse(draftStr);
    return {answer: draft.answer || '', thoughts: draft.thoughts || ''};
  } catch {
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft(problemId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${DRAFT_STORAGE_KEY}${problemId}`);
}

/**
 * Simulate AI grading with delay (mock implementation)
 */
export async function getAIFeedback(
    problemId: string, userAnswer: string,
    skillId: string): Promise<ProblemFeedback> {
  // Simulate API call delay (2-3 seconds)
  const delay = 2000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Generate mock feedback
  return generateMockFeedback(problemId, userAnswer, skillId);
}

/**
 * Calculate time spent in minutes
 */
export function calculateTimeSpent(startTime: number): number {
  const endTime = Date.now();
  const diffMs = endTime - startTime;
  return Math.round(diffMs / 1000 / 60);  // Convert to minutes
}

/**
 * Format elapsed time for display
 */
export function formatElapsedTime(startTime: number): string {
  const now = Date.now();
  const diffMs = now - startTime;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Generate encouraging message based on completion
 */
export function getEncouragementMessage(liked: boolean): string {
  if (liked) {
    const messages = [
      'Awesome! Glad you enjoyed this one!',
      'Great! We\'ll find more skills like this for you.',
      'Excellent! You\'re building a strong profile.',
      'Fantastic! Keep exploring what you love.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = [
      'Thanks for trying! Not every skill will be a perfect fit.',
      'No problem! This helps us understand what you prefer.',
      'That\'s okay! Knowing what you don\'t enjoy is just as valuable.',
      'Got it! Let\'s find something that\'s a better match.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

/**
 * Convert thumbs up/down to enjoyment rating (1-5 scale for database)
 */
export function convertThumbsToRating(liked: boolean): number {
  return liked ? 5 : 2;  // Thumbs up = 5, thumbs down = 2
}

/**
 * Save problem attempt (mock implementation - in real app, would call API)
 */
export interface SaveAttemptData {
  userId: string;
  problemId: string;
  skillId: string;
  userAnswer: string;
  thoughts: string;
  liked: boolean;
  timeSpentMinutes: number;
}

export function saveProblemAttempt(data: SaveAttemptData): void {
  // In real implementation, this would call an API
  // For now, we'll just log it and could save to localStorage
  if (typeof window === 'undefined') return;

  const attempt = {
    id: `attempt-${Date.now()}`,
    user_id: data.userId,
    problem_id: data.problemId,
    skill_id: data.skillId,
    enjoyment_rating: convertThumbsToRating(data.liked),
    difficulty_rating: 3,  // Default neutral
    completed: true,
    time_spent_minutes: data.timeSpentMinutes,
    notes: `${data.thoughts}\n\nAnswer: ${data.userAnswer}`,
    created_at: new Date().toISOString()
  };

  // Save to localStorage for demo purposes
  const attemptsKey = 'user_attempts';
  const existingAttempts = localStorage.getItem(attemptsKey);
  const attempts = existingAttempts ? JSON.parse(existingAttempts) : [];
  attempts.push(attempt);
  localStorage.setItem(attemptsKey, JSON.stringify(attempts));

  console.log('Attempt saved:', attempt);
}

/**
 * Check if answer is substantial enough to submit
 */
export function isAnswerValid(answer: string): boolean {
  return answer.trim().length >= 10;  // Minimum 10 characters
}

/**
 * Generate a new practice problem using AI via n8n webhook
 */
export async function generateAIPracticeProblem(
    skillId: string, skillName: string, skillDescription: string,
    difficulty: 'beginner'|'intermediate'|'advanced' = 'beginner',
    userId?: string): Promise<any> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate_problem',
        skillId,
        skillName,
        skillDescription,
        difficulty,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate problem: ${response.status}`);
    }

    const generatedProblem = await response.json();

    // Debug logging
    console.log('Raw webhook response:', generatedProblem);
    console.log('Title:', generatedProblem.title);
    console.log('Description:', generatedProblem.description);
    console.log('Content:', generatedProblem.content);

    // Format the response to match PracticeProblem interface
    const formattedProblem = {
      id: `problem-ai-${Date.now()}`,
      skill_id: skillId,
      title: generatedProblem.title || 'Untitled Problem',
      description: generatedProblem.description || 'No description provided',
      difficulty: difficulty,
      content: generatedProblem.content || 'No content provided',
      solution_hints: generatedProblem.solution_hints || [],
      generated_by_ai: true,
      created_at: new Date().toISOString(),
    };

    console.log('Formatted problem:', formattedProblem);

    return formattedProblem;
  } catch (error) {
    console.error('Error generating AI problem:', error);
    throw error;
  }
}

/**
 * Get feedback for user's answer from n8n webhook
 */
export async function getFeedbackFromWebhook(
    problem: PracticeProblem, userAnswer: string, skillId: string): Promise<{
  feedback_text: string;
  strengths?: string[];
  improvements?: string[]
}> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get_feedback',
        problem,  // send the full problem object
        userAnswer,
        skillId,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to get feedback: ${response.status}`);
    }
    const raw = await response.json();
    // Accept [{ output: { ... } }], { output: { ... } }, or direct object
    let feedback;
    if (Array.isArray(raw) && raw[0]?.output) {
      feedback = raw[0].output;
    } else if (raw?.output) {
      feedback = raw.output;
    } else {
      feedback = raw;
    }
    // Debug log
    console.log('Parsed feedback:', feedback);
    return feedback;
  } catch (error) {
    console.error('Error getting feedback from webhook:', error);
    throw error;
  }
}
