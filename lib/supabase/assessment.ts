export async function addAssessmentQuestionScore(
    {accuracy_score_0to1, feedback, question, skill_id}: {
      accuracy_score_0to1?: number|null;
      feedback?: string | null;
      question?: string | null;
      skill_id?: number | null;
    }) {
  const response = await fetch('/api/assessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accuracy_score_0to1,
      feedback,
      question,
      skill_id,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save assessment question score');
  }

  return response.json();
}
