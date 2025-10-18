import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecommendationsPreview } from "@/components/dashboard/recommendations-preview";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { getDashboardStats, getEncouragementMessage, formatTimeSpent } from "@/lib/dashboard-helpers";
import { MOCK_USER_PROFILE } from "@/lib/mock-data";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Get dashboard data (using mock data for now)
  const userId = 'mock-user-1';
  const stats = getDashboardStats(userId);
  const encouragement = getEncouragementMessage(userId);
  const userProfile = MOCK_USER_PROFILE;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userProfile.full_name}!
        </h1>
        <p className="text-muted-foreground">
          {encouragement}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Skills Explored"
          value={stats.skillsExplored}
          description="Unique skills you've tried"
          icon={BookOpen}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Problems Completed"
          value={stats.problemsCompleted}
          description="Practice problems finished"
          icon={CheckCircle2}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Time Spent Learning"
          value={formatTimeSpent(stats.totalTimeSpent)}
          description="Total time invested"
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Recommendations"
          value={stats.recommendationsAvailable}
          description="Personalized major matches"
          icon={Lightbulb}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning Section */}
        <div className="space-y-6">
          <ContinueLearning userId={userId} />
          <QuickActions />
        </div>

        {/* Recommendations & Activity */}
        <div className="space-y-6">
          <RecommendationsPreview userId={userId} />
          <RecentActivity userId={userId} limit={5} />
        </div>
      </div>
    </div>
  );
}
