'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { MajorDistribution } from '@/lib/progress-helpers';

interface MajorAffinityChartProps {
  distributions: MajorDistribution[];
}

const chartConfig = {
  liked: {
    label: 'Liked',
    color: 'hsl(var(--chart-1))',
  },
  disliked: {
    label: 'Disliked',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function MajorAffinityChart({ distributions }: MajorAffinityChartProps) {
  // Transform data for the chart
  const chartData = distributions.map((dist) => ({
    major: dist.majorName,
    liked: dist.liked,
    disliked: dist.disliked,
    affinityPercentage: dist.affinityPercentage,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Major Insights</CardTitle>
          <CardDescription>
            Complete practice problems to see which majors match your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p className="text-sm">No data yet - start exploring skills!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Which Majors Match Your Interests?</CardTitle>
        <CardDescription>
          Based on the skills you've tried and enjoyed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="major"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: 'Number of Skills',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const { affinityPercentage } = item.payload;
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm capitalize">{name}:</span>
                          <span className="text-sm font-bold">{value} skills</span>
                        </div>
                        {name === 'liked' && affinityPercentage !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {affinityPercentage}% affinity
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="liked"
              stackId="a"
              fill="var(--color-liked)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="disliked"
              stackId="a"
              fill="var(--color-disliked)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-1))]" />
            <span className="text-muted-foreground">Liked (4-5 stars)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">Disliked (1-2 stars)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
