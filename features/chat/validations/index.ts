import z from 'zod';

export const chat = z.object({
  id: z.string(),
  title: z.string().nullable(),
  created_at: z.string(),
  file_id: z.string().optional(),
});

export const chatsResponseSchema = z.array(chat).nullable();

export const messagesResponseSchema = z.array(
  z.object({
    content: z.string(),
    is_user: z.boolean(),
    timestamp: z.string(),
  })
);

export const messageRequestSchema = z.object({
  chat_id: z.string().optional(),
  pdf_id: z.string().optional().nullable(),
  content: z.string(),
  image_url: z.string().optional(),
});

export const messageResponseSchema = z.object({
  ai_message_id: z.string(),
  ai_response: z.string(),
  chat_id: z.string().optional(),
  title: z.string().optional(),
  user_message_id: z.string(),
});

export type Chat = z.infer<typeof chat>;
export type Message = z.infer<typeof messagesResponseSchema.element> & {
  attachments?: { type: 'image' | 'file'; name: string; uri: string }[];
};
export type UserMessage = z.infer<typeof messageRequestSchema>;
export type AIMessage = z.infer<typeof messageResponseSchema>;
