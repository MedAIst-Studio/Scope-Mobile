import z from "zod";

export const userProfileResponse = z.object({
  createdAt: z.string(),
  email: z.string().email(),
  id: z.string(),
  username: z.string(),
  isEmailVerified: z.boolean(),
  preferences: z.object({
    theme: z.enum(["light", "dark", "system"]),
    notifications: z.object({
      motivation: z.boolean(),
      reminders: z.boolean(),
      updates: z.boolean(),
    }),
  }).optional(),
});

export const userPreferencesRequest = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z.object({
    motivation: z.boolean().optional(),
    reminders: z.boolean().optional(),
    updates: z.boolean().optional(),
  }).optional(),
});

export type UserPreferencesRequest = z.infer<typeof userPreferencesRequest>;

// Usage schemas
export const featureUsageSchema = z.object({
  limit: z.number(),
  unlimited: z.boolean(),
  used: z.number(),
});

export const usageResponseSchema = z.object({
  period: z.string(),
  plan: z.string(),
  usage: z.record(z.string(), featureUsageSchema),
});

export type FeatureUsage = z.infer<typeof featureUsageSchema>;
export type UsageResponse = z.infer<typeof usageResponseSchema>;
