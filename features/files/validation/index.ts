import z from 'zod';

export const filesResponseSchema = z
  .array(
    z.object({
      id: z.string(),
      title: z.string(),
      created_at: z.string(),
      size: z.number(),
      url: z.string().optional(),
      is_saved: z.boolean().optional(),
      file_type: z.enum(['pdf', 'image', 'youtube']).optional(),
      source_url: z.string().nullable().optional(),
      extracted_text: z.string().nullable().optional(),
      thumbnail_url: z.string().nullable().optional(),
    })
  )
  .nullable();

export const saveFileResponseSchema = z.object({
  is_saved: z.boolean(),
});
