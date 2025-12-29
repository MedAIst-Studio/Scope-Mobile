import { apiClient } from '@/lib/api';

import {
  chatsResponseSchema,
  messageRequestSchema,
  messageResponseSchema,
  messagesResponseSchema,
} from '../validations';

export const chatAPI = {
  getChats: async () => {
    const { data, error } = await apiClient.get('/chats', {}, chatsResponseSchema);

    return { data, error };
  },

  updateChat: async (chatId: string, title: string) => {
    const { data, error } = await apiClient.patch(`/chats/${chatId}`, { title });

    return { data, error };
  },

  getChatMessages: async (chatId: string) => {
    const { data, error } = await apiClient.get(`/chats/${chatId}`, {}, messagesResponseSchema);

    return { data, error };
  },

  deleteChat: async (chatId: string) => {
    const { error } = await apiClient.delete(`/chats/${chatId}`);

    return { error };
  },

  sendMessage: async (
    message: string,
    file_id?: string | null,
    chatId?: string,
    image_url?: string
  ) => {
    console.log(
      'message:',
      message,
      'file_id:',
      file_id,
      'chatId:',
      chatId,
      'image_url:',
      image_url
    );

    const { data, error } = await apiClient.request({
      url: `/messages`,
      method: 'POST',
      data: {
        chat_id: chatId,
        content: message,
        pdf_id: file_id,
        image_url,
      },
      validationSchema: messageRequestSchema,
      responseSchema: messageResponseSchema,
      timeout: 60000,
    });

    return { data, error };
  },
};
