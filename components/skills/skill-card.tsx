import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
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

  // Determine badge styling and content based on user's rating
  let badgeContent = statusText;
  let badgeClass = `${statusColors.badge} flex items-center gap-1.5 px-3 py-1.5 font-medium`;
  let BadgeIcon = null;
  let cardBackgroundClass = '';
  let cardBorderClass = `border-2 ${statusColors.border}`;
  let textColorClass = '';
  
  if (skill.userLiked === true) {
    badgeContent = 'Enjoyed';
    badgeClass = 'bg-green-700 text-white dark:bg-green-600 dark:text-white hover:bg-green-700 hover:text-white dark:hover:bg-green-600 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 font-medium shadow-sm';
    BadgeIcon = ThumbsUp;
    cardBackgroundClass = 'bg-green-100 dark:bg-green-950/50';
    cardBorderClass = 'border-2 border-green-300 dark:border-green-700';
    textColorClass = 'text-green-950 dark:text-green-50';
  } else if (skill.userLiked === false) {
    badgeContent = 'Not for me';
    badgeClass = 'bg-gray-800 text-white dark:bg-gray-700 dark:text-white hover:bg-gray-800 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 font-medium shadow-sm';
    BadgeIcon = ThumbsDown;
    cardBackgroundClass = 'bg-gray-200 dark:bg-gray-900/70';
    cardBorderClass = 'border-2 border-gray-400 dark:border-gray-600';
    textColorClass = 'text-gray-950 dark:text-gray-50';
  }

  return (
    <Card className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${cardBorderClass} ${cardBackgroundClass} overflow-hidden`}>
      <CardContent className="p-6">
        {/* Status/Feedback Badge */}
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className={badgeClass}>
            {BadgeIcon && <BadgeIcon size={14} />}
            {badgeContent}
          </Badge>
          {skill.category && (
            <Badge variant="outline" className={`text-xs px-2.5 py-1 font-medium ${textColorClass ? 'bg-white/80 dark:bg-gray-800/80 border-current/20' : 'bg-background/50'}`}>
              {skill.category}
            </Badge>
          )}
        </div>

        {/* Skill Name and Description */}
        <div className="mb-4">
          <h3 className={`font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-tight ${textColorClass}`}>
            {skill.skill_name || skill.name}
          </h3>
          <p className={`text-sm line-clamp-3 leading-relaxed ${textColorClass ? textColorClass.replace('950', '800').replace('50', '200') : 'text-muted-foreground'}`}>
            {skill.skill_description}
          </p>
        </div>

        {/* Attempt Data (if exists) */}
        {skill.attemptData && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20">
            <div className="flex items-center gap-4 text-sm">
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= skill.attemptData!.enjoymentRating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {skill.attemptData.enjoymentRating}/5
                </span>
              </div>

              {/* Time Spent */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock size={15} />
                <span className="text-xs font-medium">
                  {formatTimeSpent(skill.attemptData.timeSpent)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Related Majors */}
        {relatedMajors.length > 0 && (
          <div className="mb-3">
            <p className={`text-xs font-semibold mb-2.5 uppercase tracking-wide ${textColorClass ? textColorClass.replace('950', '700').replace('50', '300') : 'text-muted-foreground'}`}>Related majors</p>
            <div className="flex flex-wrap gap-2">
              {relatedMajors.slice(0, 3).map((major) => (
                <Badge key={major.id} variant="outline" className={`text-xs font-medium hover:bg-background transition-colors ${textColorClass ? 'bg-white/80 dark:bg-gray-800/80 border-current/20' : 'bg-background/50'}`}>
                  {major.name}
                </Badge>
              ))}
              {relatedMajors.length > 3 && (
                <Badge variant="outline" className={`text-xs font-semibold ${textColorClass ? 'bg-white/80 dark:bg-gray-800/80 border-current/20' : 'bg-background/50'}`}>
                  +{relatedMajors.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          asChild 
          className="w-full font-semibold shadow-sm hover:shadow-md transition-all" 
          variant={skill.status === 'not-tried' ? 'default' : 'secondary'}
          size="lg"
        >
          <Link href={`/protected/learn/generate/${skill.skill_id || skill.id}`}>
            {skill.status === 'not-tried' ? 'Start Learning' : 'Try Again'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
