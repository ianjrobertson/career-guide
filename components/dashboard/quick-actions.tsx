import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp, User } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Browse Skills',
    description: 'Explore new skills to try',
    href: '/protected/skills',
    icon: BookOpen,
    color: 'text-blue-500'
  },
  {
    title: 'View Progress',
    description: 'See your learning journey',
    href: '/protected/progress',
    icon: TrendingUp,
    color: 'text-green-500'
  }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Card key={action.href} className="hover:shadow-md transition-shadow h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              <Link href={action.href} className="block h-full">
                <div className="flex flex-col items-start gap-3 h-full justify-center">
                  <div className={`${action.color} bg-accent p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-base mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
