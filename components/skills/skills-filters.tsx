'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { MOCK_MAJORS } from '@/lib/mock-data';
import { useState, useEffect, useCallback } from 'react';

export function SkillsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentMajor = searchParams.get('major') || '';

  // Local state for search input (for debouncing)
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  const majors = MOCK_MAJORS;

  // Update URL search params
  const updateFilters = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/protected/skills?${params.toString()}`);
  }, [router, searchParams]);

  // Update search param with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== currentSearch) {
        updateFilters({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentSearch, updateFilters]);

  const clearFilters = () => {
    setSearchQuery('');
    router.push('/protected/skills');
  };

  const hasActiveFilters = currentSearch || currentMajor;

  return (
    <div className="space-y-4">
      {/* Search and Major Filter Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Major Filter */}
        <Select
          value={currentMajor || 'all'}
          onValueChange={(value) => updateFilters({ major: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Filter by major" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Majors</SelectItem>
            {majors.map((major) => (
              <SelectItem key={major.id} value={major.id}>
                {major.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{currentSearch}&quot;
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateFilters({ search: '' });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {currentMajor && (
            <Badge variant="secondary" className="gap-1">
              Major: {majors.find(m => m.id === currentMajor)?.name}
              <button
                onClick={() => updateFilters({ major: '' })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
