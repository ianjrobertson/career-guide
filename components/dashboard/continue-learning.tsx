import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getSuggestedSkills } from '@/lib/dashboard-helpers';

interface ContinueLearningProps {
  userId?: string;
}

export function ContinueLearning({ userId = 'mock-user-1' }: ContinueLearningProps) {
  const suggestedSkills = getSuggestedSkills(userId, 3);

  if (suggestedSkills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            Continue Learning
          </CardTitle>
          <CardDescription>
            You've explored all available skills!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Great job! Check back soon for new skills to explore.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={20} />
              Continue Learning
            </CardTitle>
            <CardDescription>
              Skills we think you'll enjoy based on your interests
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/protected/skills" className="flex items-center gap-1">
              Browse All
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedSkills.map((suggestion, index) => (
            <div
              key={suggestion.skill.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {suggestion.skill.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.skill.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.skill.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {suggestion.reason}
                    </span>
                  </div>
                </div>
                <Button asChild size="sm" className="ml-4 shrink-0">
                  <Link href={`/protected/learn/${suggestion.skill.id}`}>
                    Try It
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
