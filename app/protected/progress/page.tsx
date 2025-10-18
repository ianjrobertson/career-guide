import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MajorAffinityChart } from '@/components/progress/major-affinity-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BookOpen, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import {
  getTopMajorsByAffinity,
  getProgressOverviewStats
} from '@/lib/progress-helpers';

export default async function ProgressPage() {
  const supabase = await createClient();

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  const { data: { user } } = await supabase.auth.getUser();

  const getQuestions = async (userId: string) => {
      const {data: questions, error: questionsError } = await supabase
      .from('assessment_questions_score')
      .select(`
        skill_id,
        skills!inner(
          skill_id,
          skill_name,
          major_skills_mapping!inner(
            major_id,
            majors!inner(
              major_id,
              major_name
            )
          )
        )
      `)
      .eq('student_id', userId);

      if (questionsError) {
        console.log('Error fetching questions:', questionsError)
      }
      return questions;
  }

  // Get progress data
  let distributions = getTopMajorsByAffinity('mock-user-1', 8);
  let stats = getProgressOverviewStats('mock-user-1');

  if (user?.id) {
      const questions = await getQuestions(user?.id);

      // Map the results to create a distribution of majors
      if (questions && questions.length > 0) {
        const majorDistribution = new Map<string, { majorId: string, majorName: string, count: number, skills: Set<string> }>();

        questions.forEach((question: any) => {
          const skill = question.skills;
          if (skill?.major_skills_mapping) {
            skill.major_skills_mapping.forEach((mapping: any) => {
              const major = mapping.majors;
              if (major) {
                const key = major.major_id;
                if (!majorDistribution.has(key)) {
                  majorDistribution.set(key, {
                    majorId: major.major_id,
                    majorName: major.major_name,
                    count: 0,
                    skills: new Set()
                  });
                }
                const dist = majorDistribution.get(key)!;
                dist.count += 1;
                dist.skills.add(skill.skill_id);
              }
            });
          }
        });

        // Convert to array and sort by count
        const distributionArray = Array.from(majorDistribution.values())
          .map(d => ({
            majorId: d.majorId,
            majorName: d.majorName,
            questionCount: d.count,
            uniqueSkills: d.skills.size,
            liked: d.count, // Will need actual like/dislike data
            disliked: 0
          }))
          .sort((a, b) => b.questionCount - a.questionCount)
          .slice(0, 8);

        console.log('Major Distribution:', distributionArray);

        // Update stats with real data
        stats = {
          totalSkillsExplored: new Set(questions.map((q: any) => q.skill_id)).size,
          totalMajorsExplored: majorDistribution.size,
          topMajorName: distributionArray[0]?.majorName || null,
          topMajorAffinity: distributionArray[0]
            ? Math.round((distributionArray[0].questionCount / questions.length) * 100)
            : null
        };

        // Use real distribution data
        distributions = distributionArray;
      }
  }

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
