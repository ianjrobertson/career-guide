"use client";

import { MOCK_MAJORS } from "@/lib/mock-data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MajorSelectorProps {
  selectedMajorId: string;
  onSelect: (majorId: string) => void;
}

export function MajorSelector({ selectedMajorId, onSelect }: MajorSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {MOCK_MAJORS.map((major) => {
        const isSelected = selectedMajorId === major.id;

        return (
          <Card
            key={major.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onSelect(major.id)}
          >
            <CardHeader className="relative">
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  {major.category}
                </Badge>
                <CardTitle className="text-lg">{major.name}</CardTitle>
                <CardDescription>{major.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
