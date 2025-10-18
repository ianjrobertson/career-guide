import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecommendationsPreview } from "@/components/dashboard/recommendations-preview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { getEncouragementMessage } from "@/lib/dashboard-helpers";

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
    <div className="flex-1 w-full flex flex-col items-center gap-8">
      {/* Welcome Header */}
      <div className="w-full max-w-5xl mx-auto space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {encouragement}
        </p>
      </div>

      {/* Stats Overview & Quick Actions */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Skills Explored"
          value={questions?.length ?? 0}
          description="Unique skills you've tried"
          icon={BookOpen}
          iconColor="text-blue-500"
        />
        <QuickActions />
      </div>

      {/* Recommendations & Recent Activity - Responsive Row */}
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 justify-center items-stretch">
        {/* Recommendations (left on wide screens) */}
        <div className="flex-1 space-y-6">
          <RecommendationsPreview userId={user.id} />
        </div>

        {/* Recent Activity (right on wide screens) */}
        <div className="flex-1 space-y-6">
          <RecentActivity userId={user.id} limit={5} />
        </div>
      </div>
    </div>
  );
}
