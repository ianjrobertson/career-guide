"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface MajorSelectorProps {
  selectedMajorId: number;
  onSelect: (majorId: number) => void;
}

interface Major {
    major_id: number,
    major_name: string,
}

export function MajorSelector({ selectedMajorId, onSelect }: MajorSelectorProps) {
  const supabase = createClient();
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMajors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: majors, error } = await supabase
        .from('majors')
        .select('*');

      if (error) throw error;

      setMajors(majors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load majors');
      console.error('Error fetching majors:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMajors();
  }, [])


  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={getMajors}
          className="text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (majors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No majors available
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {majors.map((major) => {
        const isSelected = selectedMajorId === major.major_id;

        return (
          <Card
            key={major.major_id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onSelect(major.major_id)}
          >
            <CardHeader className="relative">
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="space-y-2">
                <CardTitle className="text-lg">{major.major_name}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
