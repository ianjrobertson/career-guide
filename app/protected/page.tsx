import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecommendationsPreview } from "@/components/dashboard/recommendations-preview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getEncouragementMessage } from "@/lib/dashboard-helpers";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const onboarded = await supabase.from('profiles').select('onboarded').eq('id', user.id);
  if (onboarded.data) {
  const onboardedResult = onboarded.data[0].onboarded
    if (!onboardedResult) {
      redirect("/protected/onboarding")
    }
  }

  // Get user's email for display name
  const userName = user.email?.split('@')[0] || 'there';

  const userId = user.id;
  const encouragement = getEncouragementMessage(userId);

  const {data: questions, error: questionsError } = await supabase.from('assessment_questions_score').select('*').eq('student_id', user.id);

  if (questionsError) {
    console.log(questionsError)
  }

  //console.log(questions)

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {encouragement}
        </p>
      </div>

      {/* Top Bar: Stats Overview + Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Skills Explored"
          value={questions?.length ?? 0}
          description="Unique skills you've tried"
          icon={BookOpen}
          iconColor="text-blue-500"
        />
        {/* Browse Skills Card - now using StatsCard */}
        <StatsCard
          title="Browse Skills"
          value={''}
          description="Explore new skills to try"
          icon={BookOpen}
          iconColor="text-blue-500"
        />
        <Link href="/protected/skills" className="absolute inset-0" tabIndex={-1} aria-label="Browse Skills" />
        {/* View Progress Card - now using StatsCard */}
        <StatsCard
          title="View Progress"
          value={''}
          description="See your learning journey"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <Link href="/protected/progress" className="absolute inset-0" tabIndex={-1} aria-label="View Progress" />
      </div>

      {/* Main Content Grid - rearranged to fill space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="h-full flex flex-col">
          <RecommendationsPreview userId={user.id} />
        </div>
        <div className="h-full flex flex-col">
          <RecentActivity userId={user.id} limit={5} />
        </div>
      </div>
    </div>
  );
}
