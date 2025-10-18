import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillCard } from '@/components/skills/skill-card';
import { SkillsFilters } from '@/components/skills/skills-filters';
import { SkillsPagination } from '@/components/skills/skills-pagination';
import { BookOpen, Sparkles } from 'lucide-react';
import {
  getSkillsWithStatus,
  applyFilters,
  paginateSkills,
  type SkillFilters
} from '@/lib/skills-helpers';

interface SkillsPageProps {
  searchParams: Promise<{
    page?: string;
    major?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const supabase = await createClient();

  // Verify authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // Await searchParams since it's a Promise in Next.js 15
  const params = await searchParams;

  // Parse search params
  const currentPage = parseInt(params.page || '1', 10);
  const selectedMajor = params.major || '';
  const selectedCategory = params.category || '';
  const searchQuery = params.search || '';

  // Get all skills with user status
  const userId = 'mock-user-1';
  const allSkills = getSkillsWithStatus(userId);

  // Apply filters
  const filters: SkillFilters = {
    majorIds: selectedMajor ? [selectedMajor] : [],
    category: selectedCategory || null,
    searchQuery: searchQuery || undefined
  };

  const filteredSkills = applyFilters(allSkills, filters);

  // Paginate results
  const paginatedData = paginateSkills(filteredSkills, currentPage);

  // Calculate stats
  const totalSkills = allSkills.length;
  const triedSkills = allSkills.filter(s => s.status !== 'not-tried').length;
  const enjoyedSkills = allSkills.filter(s => s.status === 'enjoyed').length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Skills</h1>
            <p className="text-muted-foreground">
              Discover your interests through hands-on practice problems
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">
              {totalSkills} total skills
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">
              {triedSkills} tried
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              {enjoyedSkills} enjoyed
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <SkillsFilters />

      {/* Results */}
      {paginatedData.totalItems === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Sparkles size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No skills found</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            We couldn't find any skills matching your filters. Try adjusting your search criteria or clearing the filters.
          </p>
        </div>
      ) : (
        <>
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.items.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          {/* Pagination */}
          <SkillsPagination paginatedData={paginatedData} />
        </>
      )}
    </div>
  );
}
