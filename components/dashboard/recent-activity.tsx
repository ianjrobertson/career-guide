import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface RecentActivityProps {
  userId?: string;
  limit?: number;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}


export async function RecentActivity({ userId = 'mock-user-1', limit = 5 }: RecentActivityProps) {
  const supabase = await createClient();

  // Query recent questions with skill information
  const { data: questions, error: questionsError } = await supabase
    .from('assessment_questions_score')
    .select(`
      assessment_id,
      student_id,
      skill_id,
      accuracy_score_0to1,
      created_at,
      skills!inner(
        skill_id,
        skill_name
      )
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (questionsError) {
    console.error('Error fetching recent activity:', questionsError);
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your learning journey will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet. Start exploring skills to see your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest skill explorations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {questions.map((question) => (
            <div
              key={question.assessment_id}
              className="flex items-start gap-4 p-3 rounded-lg border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">
                    {question.skills?.skill_name || 'Unknown Skill'}
                  </h3>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {question.accuracy_score_0to1 !== null ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {formatTimeAgo(question.created_at)}
                </p>

                {question.accuracy_score_0to1 !== null && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">
                        Score: {Math.round(question.accuracy_score_0to1 * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
