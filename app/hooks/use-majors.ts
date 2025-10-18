'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Major {
    major_id: number,
    major_name: string,
}

interface UseMajorsReturn {
    majors: Major[];
    loading: boolean;
    error: Error | null;
}

export function useMajors(): UseMajorsReturn {
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                setLoading(true);
                const supabase = createClient();

                
                const { data: majors, error } = await supabase
                    .from('majors')
                    .select('*');


                if (error) throw error;

                setMajors(majors || []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch majors'));
                setMajors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMajors();
    }, []);

    return { majors, loading, error };
}