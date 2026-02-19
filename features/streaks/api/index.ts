import { apiClient } from "@/lib/api";
import { usageStatsResponseSchema } from "../validation";


export const streakAPI = {
    getStreak: async () => {
        const { data, error } = await apiClient.get("/users/usage-stats", {

        }, usageStatsResponseSchema);

        return { data, error };
    }
}