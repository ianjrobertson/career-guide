'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
    id: string;
    full_name: string | null;
    year: string | null;
    current_major: string | null;
    interests: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProfileData {
    full_name: string;
    year?: string;
    current_major?: string;
    interests?: string[];
}

export interface UpdateProfileData {
    full_name?: string;
    year?: string;
    current_major?: string;
    interests?: string[];
}

interface UseUserProfileReturn {
    profile: UserProfile | null;
    loading: boolean;
    error: Error | null;
    createProfile: (data: CreateProfileData) => Promise<UserProfile | null>;
    updateProfile: (data: UpdateProfileData) => Promise<UserProfile | null>;
    deleteProfile: () => Promise<boolean>;
    refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const supabase = createClient();

    // Fetch profile on mount
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setProfile(null);
                setError(null);
                return;
            }

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            setProfile(data || null);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Create profile
    const createProfile = async (data: CreateProfileData): Promise<UserProfile | null> => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data: newProfile, error } = await supabase
                .from('user_profiles')
                .insert({
                    id: user.id,
                    full_name: data.full_name,
                    year: data.year || null,
                    current_major: data.current_major || null,
                    interests: data.interests || [],
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            setProfile(newProfile);
            setError(null);
            return newProfile;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to create profile');
            setError(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update profile
    const updateProfile = async (data: UpdateProfileData): Promise<UserProfile | null> => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { data: updatedProfile, error } = await supabase
                .from('user_profiles')
                .update({
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            setProfile(updatedProfile);
            setError(null);
            return updatedProfile;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update profile');
            setError(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete profile
    const deleteProfile = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', user.id);

            if (error) throw error;

            setProfile(null);
            setError(null);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to delete profile');
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Refresh profile manually
    const refreshProfile = async () => {
        await fetchProfile();
    };

    return {
        profile,
        loading,
        error,
        createProfile,
        updateProfile,
        deleteProfile,
        refreshProfile
    };
}