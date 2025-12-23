import z from "zod";

export const filesResponseSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string(),
      created_at: z.string(),
      size: z.number(),
    }),
  )
  .nullable();
