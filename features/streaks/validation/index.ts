import z from "zod";

export const usageStatsResponseSchema = z.object({
    current_streak: z.number(),
    max_streak: z.number(),
    has_played_today: z.boolean(),
    recent_active_dates: z.array(z.string()),
})

export type UsageStatsResponse = z.infer<typeof usageStatsResponseSchema>