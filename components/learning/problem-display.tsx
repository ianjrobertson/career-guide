'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { PracticeProblem, Skill } from '@/lib/mock-data';

interface ProblemDisplayProps {
  problem: PracticeProblem;
  skill: Skill;
}

export function ProblemDisplay({ problem, skill }: ProblemDisplayProps) {
  
  // Collapsible state for tutorial section
  const [tutorialExpanded, setTutorialExpanded] = useState(false);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="text-2xl font-bold flex items-center gap-3">
              {skill.name}
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-base font-semibold capitalize">
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Collapsible Tutorial/Description Section */}
        {problem.description && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer"
              onClick={() => setTutorialExpanded((prev) => !prev)}
              aria-expanded={tutorialExpanded}
              aria-controls="tutorial-desc"
              style={{ marginBottom: tutorialExpanded ? '0' : '0' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Lightbulb size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-blue-900 dark:text-blue-100">
                  How to Approach This
                </h3>
              </div>
              {tutorialExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {tutorialExpanded && (
              <div className="px-4 pb-4">
                <p
                  id="tutorial-desc"
                  className="text-base leading-relaxed text-blue-900 dark:text-blue-100"
                >
                  {problem.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Problem Context/Content */}
        <div className="p-4 rounded-lg bg-accent/50 border">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {problem.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
