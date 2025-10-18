import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MajorAffinityChart } from '@/components/progress/major-affinity-chart';
import { ProgressInsights } from '@/components/progress/progress-insights';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BookOpen, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import {
  getTopMajorsByAffinity,
  getProgressInsights,
  getProgressOverviewStats
} from '@/lib/progress-helpers';

export default async function ProgressPage() {
  const supabase = await createClient();

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Get progress data
  const userId = 'mock-user-1';
  const distributions = getTopMajorsByAffinity(userId, 8);
  const insights = getProgressInsights(userId);
  const stats = getProgressOverviewStats(userId);

  const hasData = stats.totalSkillsExplored > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground">
              Discover which majors align with the skills you enjoy
            </p>
          </div>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          <div className="p-4 bg-muted rounded-full">
            <BookOpen size={48} className="text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold">Start Your Journey</h3>
            <p className="text-sm text-muted-foreground">
              Complete some practice problems to see which majors match your interests.
              The more skills you try, the better we can understand your preferences!
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/protected/skills" className="gap-2">
              <Sparkles size={18} />
              Explore Skills
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Skills Explored
                    </p>
                    <p className="text-3xl font-bold">{stats.totalSkillsExplored}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BookOpen size={20} className="text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Majors Explored
                    </p>
                    <p className="text-3xl font-bold">{stats.totalMajorsExplored}</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Target size={20} className="text-purple-600 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Top Match
                    </p>
                    <p className="text-xl font-bold line-clamp-1">
                      {stats.topMajorName || 'N/A'}
                    </p>
                    {stats.topMajorAffinity !== null && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        {stats.topMajorAffinity}% affinity
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Sparkles size={20} className="text-green-600 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart */}
          <MajorAffinityChart distributions={distributions} />

          {/* Insights */}
          <ProgressInsights insights={insights} />

          {/* CTA Section */}
          <div className="flex justify-center pt-4">
            <Button asChild size="lg" variant="default">
              <Link href="/protected/skills" className="gap-2">
                <BookOpen size={18} />
                Explore More Skills
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
