import z from "zod";

export const usageStatsResponseSchema = z.object({
    currentStreak: z.number(),
    maxStreak: z.number(),
    hasPlayedToday: z.boolean(),
    recentActiveDates: z.array(z.string()),
}).transform((data) => ({
    current_streak: data.currentStreak,
    max_streak: data.maxStreak,
    had_played_today: data.hasPlayedToday,
    recent_active_dates: data.recentActiveDates,
}))

export type UsageStatsResponse = z.infer<typeof usageStatsResponseSchema>