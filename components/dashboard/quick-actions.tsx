import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp} from 'lucide-react';

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
    <>
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <div className="w-full" key={action.href}>
            <Card className="hover:shadow-md transition-shadow w-full">
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
          </div>
        );
      })}
    </>
  );
}
