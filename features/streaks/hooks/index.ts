import { useQuery } from '@tanstack/react-query';

import { streakAPI } from '../api';

export const STREAK_QUERY_KEY = 'streak';

/**
 * Hook to fetch usageStats / streak data
 */
export const useStreak = () => {
    return useQuery({
        queryKey: [STREAK_QUERY_KEY],
        queryFn: async () => {
            const { data, error } = await streakAPI.getStreak();

            if (error) {
                throw new Error(error.message || 'Seri bilgisi yüklenirken bir hata oluştu');
            }

            return data;
        },
        staleTime: 1000 * 60 * 15, // 15 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};
