import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ProgressInsightsProps {
  insights: string[];
}

export function ProgressInsights({ insights }: ProgressInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
            <Sparkles size={24} className="text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">Your Insights</h3>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
