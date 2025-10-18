import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SkillWithStatus } from '@/lib/skills-helpers';
import { getStatusColorClasses, getStatusText } from '@/lib/skills-helpers';
import { getMajorsBySkillId } from '@/lib/mock-data';
import { formatTimeSpent } from '@/lib/dashboard-helpers';

interface SkillCardProps {
  skill: SkillWithStatus;
}

export function SkillCard({ skill }: SkillCardProps) {
  const statusColors = getStatusColorClasses(skill.status);
  const statusText = getStatusText(skill.status);
  const relatedMajors = getMajorsBySkillId(skill.id);

  // Get status icon
  const StatusIcon = skill.status === 'enjoyed'
    ? CheckCircle2
    : skill.status === 'disliked'
    ? AlertCircle
    : null;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 border-2 ${statusColors.border}`}>
      <CardContent className="p-6">
        {/* Status Badge */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className={`${statusColors.badge} flex items-center gap-1`}>
            {StatusIcon && <StatusIcon size={12} />}
            {statusText}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {skill.category}
          </Badge>
        </div>

        {/* Skill Name and Description */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {skill.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {skill.description}
        </p>

        {/* Attempt Data (if exists) */}
        {skill.attemptData && (
          <div className="mb-4 p-3 rounded-md bg-accent/50">
            <div className="flex items-center gap-4 text-sm">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= skill.attemptData!.enjoymentRating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {skill.attemptData.enjoymentRating}/5
                </span>
              </div>

              {/* Time Spent */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={14} />
                <span className="text-xs">
                  {formatTimeSpent(skill.attemptData.timeSpent)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Related Majors */}
        {relatedMajors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Related majors:</p>
            <div className="flex flex-wrap gap-1.5">
              {relatedMajors.slice(0, 3).map((major) => (
                <Badge key={major.id} variant="outline" className="text-xs">
                  {major.name}
                </Badge>
              ))}
              {relatedMajors.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{relatedMajors.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" variant={skill.status === 'not-tried' ? 'default' : 'secondary'}>
          <Link href={`/protected/learn/${skill.id}`}>
            {skill.status === 'not-tried' ? 'Try It' : 'Try Again'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
