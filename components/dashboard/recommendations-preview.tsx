import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { getTopRecommendations, hasEnoughDataForRecommendations } from '@/lib/dashboard-helpers';

interface RecommendationsPreviewProps {
  userId?: string;
}

export function RecommendationsPreview({ userId = 'mock-user-1' }: RecommendationsPreviewProps) {
  const hasEnoughData = hasEnoughDataForRecommendations(userId);

  if (!hasEnoughData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb size={20} />
            Your Recommendations
          </CardTitle>
          <CardDescription>
            Complete more problems to unlock personalized major recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Try at least 3 skills to get personalized major recommendations
            </p>
            <Button asChild>
              <Link href="/protected/skills">
                Browse Skills
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topRecommendations = getTopRecommendations(userId, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={20} />
              Your Top Recommendations
            </CardTitle>
            <CardDescription>
              Majors that match your interests based on skills you enjoyed
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/protected/progress" className="flex items-center gap-1">
              View All
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRecommendations.map((rec, index) => (
            <div
              key={rec.recommendation.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {rec.majorName}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {rec.majorDescription}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-2xl font-bold text-primary">
                    {rec.recommendation.match_score}%
                  </p>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </div>

              <Progress value={rec.recommendation.match_score} className="h-2 mb-3" />

              <div className="flex flex-wrap gap-1.5">
                {rec.matchingSkillNames.map((skillName, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skillName}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
