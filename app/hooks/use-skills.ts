'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Skill {
    skill_id: number;
    skill_name: string;
}

interface UseSkillsReturn {
    skills: Skill[];
    loading: boolean;
    error: Error | null;
}

export function useSkills(): UseSkillsReturn {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('name');

                if (error) throw error;

                setSkills(data || []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch skills'));
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return { skills, loading, error };
}
