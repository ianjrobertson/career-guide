'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginatedResult } from '@/lib/skills-helpers';
import type { SkillWithStatus } from '@/lib/skills-helpers';

interface SkillsPaginationProps {
  paginatedData: PaginatedResult<SkillWithStatus>;
}

export function SkillsPagination({ paginatedData }: SkillsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentPage, totalPages, hasNextPage, hasPreviousPage, totalItems } = paginatedData;

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/protected/skills?${params.toString()}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startIndex = (currentPage - 1) * paginatedData.items.length + 1;
  const endIndex = Math.min(startIndex + paginatedData.items.length - 1, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {startIndex}-{endIndex} of {totalItems} skills
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="gap-1"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updatePage(page as number)}
                  className="min-w-[2.5rem]"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Current page indicator (mobile) */}
        <div className="sm:hidden text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage + 1)}
          disabled={!hasNextPage}
          className="gap-1"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
