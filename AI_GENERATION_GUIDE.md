# AI-Generated Practice Problems - Integration Guide

## Overview
Your career-guide app now generates practice problems using AI through an n8n webhook. Here's how everything connects:

## Architecture

```
User clicks skill
    ↓
/protected/learn/generate/[skillId]  (Generate page)
    ↓
User selects difficulty
    ↓
generateAIPracticeProblem()  (Helper function)
    ↓
POST /api/generate  (API route)
    ↓
n8n webhook  (Your AI service)
    ↓
Returns generated problem
    ↓
Stores in sessionStorage
    ↓
Redirects to /protected/learn/[problemId]
    ↓
AIGeneratedLearning component loads problem
    ↓
LearningContainer displays it
```

## Files Changed

### 1. `/lib/learning-helpers.ts`
**New Function:** `generateAIPracticeProblem()`
- Calls `/api/generate` with action: 'generate_problem'
- Sends skill info and difficulty level
- Returns formatted PracticeProblem object

### 2. `/app/protected/learn/generate/[skillId]/page.tsx` (NEW)
- Server component that receives skillId
- Fetches skill data
- Renders GenerateProblemClient component

### 3. `/components/learning/generate-problem-client.tsx` (NEW)
- Client component with difficulty selection UI
- Calls `generateAIPracticeProblem()` when user selects difficulty
- Stores generated problem in sessionStorage
- Redirects to learning page

### 4. `/components/learning/ai-generated-learning.tsx` (NEW)
- Client component that loads problem from sessionStorage
- Handles AI-generated problems (IDs starting with 'problem-ai-')
- Renders LearningContainer with the generated problem

### 5. `/app/protected/learn/[problemId]/page.tsx` (UPDATED)
- Now checks if problemId starts with 'problem-ai-'
- Routes AI-generated problems to AIGeneratedLearning component
- Redirects to generate page when no problems exist for a skill

## Expected n8n Webhook Response

Your n8n webhook should receive:
```json
{
  "action": "generate_problem",
  "skillId": "skill-3",
  "skillName": "Data Analysis",
  "skillDescription": "Extract insights from datasets...",
  "difficulty": "beginner",
  "userId": "mock-user-1"
}
```

And return:
```json
{
  "title": "Analyzing Customer Feedback Data",
  "description": "Work with survey data to identify trends",
  "content": "You've been given a dataset of 500 customer surveys...",
  "solution_hints": [
    "Start by grouping responses by age",
    "Look for patterns in satisfaction scores"
  ]
}
```

## User Flow

1. **User browses skills** at `/protected/skills`
2. **Clicks a skill** that has no existing problems
3. **Redirected to** `/protected/learn/generate/[skillId]`
4. **Sees generation page** with difficulty options
5. **Selects difficulty** (beginner/intermediate/advanced)
6. **Loading state** while AI generates problem
7. **Problem generated** and stored
8. **Redirected to** `/protected/learn/problem-ai-[timestamp]`
9. **Completes practice** just like any other problem

## Testing

To test the integration:

1. Click on a skill that has no problems
2. You should see the generation page
3. Select a difficulty level
4. Check browser console for API calls
5. Check Network tab for `/api/generate` request/response

## Next Steps

1. **Update your n8n workflow** to accept the new payload format
2. **Implement proper AI generation** in n8n (Claude, GPT, etc.)
3. **Test the response format** matches expected structure
4. **Add error handling** in n8n for edge cases
5. **Consider storing generated problems** in database for reuse

## Fallback Behavior

If AI generation fails:
- Error message displays to user
- User can try again with different difficulty
- Can return to skills browser

## Notes

- AI-generated problems use IDs like: `problem-ai-1729267890123`
- Problems are stored in sessionStorage (temporary)
- To persist problems, integrate with Supabase database
- Currently uses mock userId - replace with real auth in production
