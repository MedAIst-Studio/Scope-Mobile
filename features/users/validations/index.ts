import z from "zod";

export const userProfileResponse = z.object({
  createdAt: z.string(),
  email: z.email(),
  id: z.string(),
  username: z.string(),
  isEmailVerified: z.boolean(),
});
