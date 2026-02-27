import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

// import {chatKeys} from "@/features/chat/hooks";

import { UsageStatsResponse } from '@/features/streaks/validation';
import { fileAPI } from '../api';

export const FILES_QUERY_KEY = 'files';

export const useFiles = () => {
  return useQuery({
    queryKey: [FILES_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await fileAPI.getFiles();

      if (error) {
        console.error('Files fetch error', error);
        throw error;
      }

      return data || [];
    },
    staleTime: Infinity,
    refetchOnMount: true, // often better to re-fetch on mount in mobile
    refetchOnWindowFocus: false,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file_title, file_data }: { file_title: string; file_data: any }) => {
      const { data, error } = await fileAPI.uploadFile(file_title, file_data);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY] });

      const currentStreak = queryClient.getQueryData<UsageStatsResponse>(["streak", "user", "usage"]);

      if (currentStreak && currentStreak.has_played_today === false) {
        queryClient.invalidateQueries({ queryKey: ['streak', 'user', 'usage'] });
      }
    },
    onError: (error: Error) => {
      Alert.alert('Hata', error.message || 'Dosya yüklenirken bir hata oluştu.');
    },
  });
};

export const useGetFile = (fileId: string) => {
  return useQuery({
    queryKey: [FILES_QUERY_KEY, fileId],
    queryFn: async () => {
      const { data, error } = await fileAPI.getFile(fileId);

      if (error) {
        console.error('Get file error', error);
        throw error;
      }

      return data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await fileAPI.deleteFile(fileId);

      if (error) {
        throw error;
      }

      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY] });
    },
    onError: (error: Error) => {
      Alert.alert('Hata', error.message || 'Dosya silinirken bir hata oluştu.');
    },
  });
};
