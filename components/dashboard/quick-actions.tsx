import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Lightbulb, User } from 'lucide-react';

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
  },
  {
    title: 'Recommendations',
    description: 'Discover matching majors',
    href: '/protected/recommendations',
    icon: Lightbulb,
    color: 'text-yellow-500'
  },
  {
    title: 'Profile',
    description: 'Manage your account',
    href: '/protected/profile',
    icon: User,
    color: 'text-purple-500'
  }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Card key={action.href} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href={action.href} className="block">
                <div className="flex flex-col items-start gap-3">
                  <div className={`${action.color} bg-accent p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <div>
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
