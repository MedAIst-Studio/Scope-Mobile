import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

// import {chatKeys} from "@/features/chat/hooks";

import { UsageStatsResponse } from '@/features/streaks/validation';
import { fileAPI } from '../api';
import { File } from '../types';

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
      queryClient.invalidateQueries({ queryKey: ['user', 'usage'] });

      const currentStreak = queryClient.getQueryData<UsageStatsResponse>(["streak"]);

      if (currentStreak && currentStreak.has_played_today === false) {
        queryClient.invalidateQueries({ queryKey: ['streak'] });
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

export const useSaveFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await fileAPI.saveFile(fileId);

      if (error) {
        throw error;
      }

      return fileId;
    },
    onMutate: async (fileId: string) => {
      await queryClient.cancelQueries({ queryKey: [FILES_QUERY_KEY] });

      const previousFiles = queryClient.getQueryData<File[]>([FILES_QUERY_KEY]);

      if (previousFiles) {
        queryClient.setQueryData<File[]>(
          [FILES_QUERY_KEY],
          previousFiles.map((file) =>
            file.id === fileId ? { ...file, is_saved: true } : file
          )
        );
      }

      return { previousFiles };
    },
    onError: (error: Error, _fileId, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData<File[]>([FILES_QUERY_KEY], context.previousFiles);
      }

      Alert.alert(
        'Hata',
        error.message || 'Dosya kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY] });
    },
  });
};
