import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { AuthAPI } from '@/features/auth/api';
import { handleLogout } from '@/features/auth/utils';

import { userAPI } from '../api';
import { User } from '../types';

// User details query
export const useUserDetails = () => {
  return useQuery<User>({
    queryKey: ['user', 'profile'],
    queryFn: async (): Promise<User> => {
      const { data, error } = await userAPI.getUserDetails();

      if (error) {
        throw new Error(error.message || 'Kullanıcı bilgileri alınamadı');
      }

      return data as User;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      const { error } = await userAPI.updateUserDetails(username);

      if (error) {
        throw new Error(error.message || 'Kullanıcı bilgileri güncellenemedi');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      Alert.alert('Başarılı', 'Profil bilgileri başarıyla güncellendi');
    },
    onError: (error: Error) => {
      Alert.alert('Hata', error.message);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const { error } = await userAPI.updatePassword(oldPassword, newPassword);

      if (error) {
        throw new Error(error.message || 'Şifre değiştirilemedi');
      }
    },
    onSuccess: () => {
      Alert.alert('Başarılı', 'Şifre başarıyla değiştirildi');
    },
    onError: (error: Error) => {
      Alert.alert('Hata', error.message);
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await userAPI.deleteAccount();

      if (error) {
        throw new Error(error.message || 'Hesap silinemedi');
      }
    },
    onSuccess: async () => {
      await AuthAPI.logout();
      await handleLogout();
      Alert.alert('Başarılı', 'Hesap başarıyla silindi');
    },
    onError: (error: Error) => {
      Alert.alert('Hata', error.message);
    },
  });
};
