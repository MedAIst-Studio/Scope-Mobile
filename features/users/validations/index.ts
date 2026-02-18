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
      announcements: z.boolean(),
      newFeatures: z.boolean(),
    }),
  }).optional(),
});

export const userPreferencesRequest = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z.object({
    motivation: z.boolean().optional(),
    reminders: z.boolean().optional(),
    announcements: z.boolean().optional(),
    newFeatures: z.boolean().optional(),
  }).optional(),
});

export type UserPreferencesRequest = z.infer<typeof userPreferencesRequest>;
