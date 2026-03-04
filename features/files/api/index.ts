import { apiClient } from '@/lib/api';

import { filesResponseSchema, saveFileResponseSchema } from '../validation';

export const fileAPI = {
  uploadFile: async (
    file_title: string,
    file_data: { uri: string; name: string; type: string }
  ) => {
    const formData = new FormData();

    formData.append('file_title', file_title);
    // @ts-ignore: FormData in RN expects this object structure even if TS complains it should be string | Blob
    formData.append('file_data', {
      uri: file_data.uri,
      name: file_data.name,
      type: file_data.type,
    });

    const { data, error } = await apiClient.request({
      url: '/files/upload',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10 * 60 * 1000,
    });

    return { data, error };
  },

  getFiles: async () => {
    const { data, error } = await apiClient.get('/files', undefined, filesResponseSchema);

    return { data, error };
  },

  getFile: async (fileId: string) => {
    console.warn('getFile implementation pending for React Native');
    return { data: null, error: null };
  },

  deleteFile: async (fileId: string) => {
    const { error } = await apiClient.delete(`/files/${fileId}`);

    return { error };
  },

  saveFile: async (fileId: string) => {
    const { error } = await apiClient.patch(`/files/${fileId}/save`, {}, {
      response: saveFileResponseSchema,
    });

    return { error };
  },
};
