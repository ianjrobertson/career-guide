import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillCard } from '@/components/skills/skill-card';
import { SkillsFilters } from '@/components/skills/skills-filters';
import { SkillsPagination } from '@/components/skills/skills-pagination';
import { BookOpen, Sparkles } from 'lucide-react';
import {
  applyFilters,
  paginateSkills,
  type SkillFilters
} from '@/lib/skills-helpers';

interface SkillsPageProps {
  searchParams: Promise<{
    page?: string;
    major?: string;
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
  const searchQuery = params.search || '';


  // Fetch all skills with their major mappings from Supabase
  let query = supabase
    .from('skills')
    .select(`
      skill_id,
      skill_name,
      skill_description,
      major_skills_mapping!inner (
        major_id
      )
    `);

  // Add major filter if specified
  if (selectedMajor) {
    query = query.eq('major_skills_mapping.major_id', selectedMajor);
  }

  const { data: skillsData, error: skillsError } = await query;

  if (skillsError) {
    console.error('Supabase skills query error:', skillsError);
    throw new Error(`Failed to fetch skills from Supabase: ${skillsError.message}`);
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Fetch user's assessment feedback from Supabase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let assessmentFeedback: any[] = [];
  if (userId) {
    const { data: feedbackData } = await supabase
      .from('assessment_questions_score')
      .select('skill_id, user_liked, created_at')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });
    
    assessmentFeedback = feedbackData || [];
  }

  // Transform skills data and merge with user feedback
  const allSkills = skillsData.map((skill: any) => {
    const skillId = skill.skill_id;
    const latestFeedback = assessmentFeedback.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fb: any) => fb.skill_id === skillId
    );

    // Get array of major_ids from the major_skills_mapping, always as strings
    const majorIds = skill.major_skills_mapping.map((mapping: any) => String(mapping.major_id));

    return {
      ...skill,
      id: skillId, // Ensure id is available for compatibility
      status: latestFeedback ? 'tried' : 'not-tried',
      userLiked: latestFeedback?.user_liked ?? null,
      major_ids: majorIds // Add the major_ids array as strings
    };
  });

  // Apply filters
  const filters: SkillFilters = {
    majorIds: selectedMajor ? [selectedMajor] : [],
    category: null,
    searchQuery: searchQuery || undefined
  };

  const filteredSkills = applyFilters(allSkills, filters);

  // Paginate results
  const paginatedData = paginateSkills(filteredSkills, currentPage);

  // Calculate stats
  const totalSkills = allSkills.length;
  const triedSkills = allSkills.filter(s => s.userLiked !== null).length;
  const enjoyedSkills = allSkills.filter(s => s.userLiked === true).length;
  const dislikedSkills = allSkills.filter(s => s.userLiked === false).length;

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
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              {enjoyedSkills} enjoyed
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-muted-foreground">
              {dislikedSkills} not enjoyed
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">
              {totalSkills - triedSkills} not tried
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
            We couldn&apos;t find any skills matching your filters. Try adjusting your search criteria or clearing the filters.
          </p>
        </div>
      ) : (
        <>
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.items.map((skill, idx) => (
              <SkillCard key={skill.id ?? idx} skill={skill} />
            ))}
          </div>

          {/* Pagination */}
          <SkillsPagination paginatedData={paginatedData} />
        </>
      )}
    </div>
  );
}
