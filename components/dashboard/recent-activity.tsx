import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';
import { getRecentActivity } from '@/lib/dashboard-helpers';
import { formatTimeSpent } from '@/lib/dashboard-helpers';

interface RecentActivityProps {
  userId?: string;
  limit?: number;
}

export function RecentActivity({ userId = 'mock-user-1', limit = 5 }: RecentActivityProps) {
  const activities = getRecentActivity(userId, limit);

  if (activities.length === 0) {
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
          {activities.map((activity) => (
            <div
              key={activity.attempt.id}
              className="flex items-start gap-4 p-3 rounded-lg border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">
                    {activity.skillName}
                  </h3>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {activity.attempt.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {activity.timeAgo} • {formatTimeSpent(activity.attempt.time_spent_minutes)}
                </p>

                {activity.attempt.completed && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">
                        {activity.attempt.enjoyment_rating}/5 enjoyment
                      </span>
                    </div>
                  </div>
                )}

                {activity.attempt.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1 italic">
                    "{activity.attempt.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
