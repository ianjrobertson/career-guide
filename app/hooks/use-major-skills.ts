'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Skill {
    skill_id: number;
    skill_name: string;
}

interface Major {
    major_id: number;
    major_name: string;
}

interface UseMajorSkillsReturn {
    loading: boolean;
    error: Error | null;
    getSkills: (majorId: number) => Promise<Skill[]>;
    getMajors: (skillId: number) => Promise<Major[]>;
}

export function useMajorSkills(): UseMajorSkillsReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getSkills = async (majorId: number): Promise<Skill[]> => {
        try {
            setLoading(true);
            setError(null);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('major_skills')
                .select(`
                    skill_id,
                    skills!inner (
                        skill_id,
                        skill_name
                    )
                `)
                .eq('major_id', majorId);

            if (error) throw error;

            const skills = data?.map(item => item.skills).filter(Boolean) as unknown as Skill[];
            return skills || [];
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error('Failed to fetch skills');
            setError(errorObj);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getMajors = async (skillId: number): Promise<Major[]> => {
        try {
            setLoading(true);
            setError(null);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('major_skills')
                .select(`
                    major_id,
                    majors!inner (
                        major_id,
                        major_name
                    )
                `)
                .eq('skill_id', skillId);

            if (error) throw error;

            const majors = data?.map(item => item.majors).filter(Boolean) as unknown as Major[];
            return majors || [];
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error('Failed to fetch majors');
            setError(errorObj);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, getSkills, getMajors };
}
