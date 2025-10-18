'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import type { PracticeProblem, Skill } from '@/lib/mock-data';

interface ProblemDisplayProps {
  problem: PracticeProblem;
  skill: Skill;
}

export function ProblemDisplay({ problem, skill }: ProblemDisplayProps) {
  const [hintsExpanded, setHintsExpanded] = useState(false);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{skill.name}</Badge>
              <Badge variant="outline" className="capitalize">
                {problem.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{problem.title}</CardTitle>
          </div>
        </div>
        {problem.description && (
          <p className="text-sm text-muted-foreground">
            {problem.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Problem Context/Content */}
        <div className="p-4 rounded-lg bg-accent/50 border">
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
            Problem
          </h3>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {problem.content}
          </p>
        </div>

        {/* Hints Section (Collapsible) */}
        {problem.solution_hints && problem.solution_hints.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 hover:bg-accent"
              onClick={() => setHintsExpanded(!hintsExpanded)}
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-yellow-500" />
                <span className="font-medium">
                  Need a hint? ({problem.solution_hints.length} available)
                </span>
              </div>
              {hintsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            {hintsExpanded && (
              <div className="p-4 pt-0 space-y-2">
                {problem.solution_hints.map((hint, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground flex-1">{hint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
