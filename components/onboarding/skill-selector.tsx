"use client";

import { Skill } from "@/lib/mock-data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillSelectorProps {
  skills: Skill[];
  selectedSkillIds: string[];
  onSelect: (skillIds: string[]) => void;
  minRequired: number;
  maxAllowed: number;
}

export function SkillSelector({
  skills,
  selectedSkillIds,
  onSelect,
  minRequired,
  maxAllowed,
}: SkillSelectorProps) {
  const handleToggle = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      // Deselect
      onSelect(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      // Select (only if under max)
      if (selectedSkillIds.length < maxAllowed) {
        onSelect([...selectedSkillIds, skillId]);
      }
    }
  };

  const selectedCount = selectedSkillIds.length;
  const remainingToSelect = Math.max(0, minRequired - selectedCount);
  const canSelectMore = selectedCount < maxAllowed;

  return (
    <div className="space-y-4">
      {/* Selection Status */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <p className="text-sm font-medium">
            {selectedCount} of {maxAllowed} skills selected
          </p>
          {remainingToSelect > 0 && (
            <p className="text-xs text-muted-foreground">
              Select at least {remainingToSelect} more to continue
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: maxAllowed }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < selectedCount ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {skills.map((skill) => {
          const isSelected = selectedSkillIds.includes(skill.id);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <Card
              key={skill.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary bg-primary/5",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && handleToggle(skill.id)}
            >
              <CardHeader className="relative p-4">
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Badge variant="outline" className="w-fit text-xs">
                    {skill.category}
                  </Badge>
                  <CardTitle className="text-base leading-tight">
                    {skill.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {skill.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No skills available for this major.</p>
          <p className="text-sm">Please go back and select a different major.</p>
        </div>
      )}
    </div>
  );
}
