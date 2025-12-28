import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useDeleteAccount, useUpdateUserDetails, useUserDetails } from '@/features/users/hooks';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from 'react-native';
import {
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  KeyIcon,
  TrashIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: user, isLoading } = useUserDetails();
  const { mutateAsync: updateDetails, isPending: isUpdating } = useUpdateUserDetails();
  const { mutateAsync: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!username.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş olamaz');
      return;
    }
    await updateDetails(username);
  };

  const handleDelete = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center gap-4 px-4 pb-6 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="-ml-2 p-2">
          <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Profil Bilgileri</Text>
      </View>

      <View className="flex-1 px-4">
        {/* Avatar Placeholder */}
        <View className="mb-8 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Icon as={UserIcon} size={48} className="text-muted-foreground" />
          </View>
          <Text className="mt-4 text-sm text-muted-foreground">{user?.email}</Text>
        </View>

        {/* Inputs */}
        <View className="gap-4">
          <View>
            <Text className="mb-1.5 ml-1 text-sm font-medium text-foreground">Kullanıcı Adı</Text>
            <TextInput
              className="rounded-lg border border-border bg-card px-4 py-3 text-foreground"
              value={username}
              onChangeText={setUsername}
              placeholder="Kullanıcı Adı"
              placeholderTextColor="#6B7280"
            />
          </View>

          <Button onPress={handleUpdate} disabled={isUpdating} className="mt-2 bg-primary">
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-primary-foreground">Güncelle</Text>
            )}
          </Button>

          <View className="my-4 h-[1px] bg-border" />

          <TouchableOpacity
            onPress={() => router.push('/(app)/profile/password')}
            className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <Icon as={KeyIcon} size={20} className="text-foreground" />
              <Text className="font-medium text-foreground">Şifreyi Değiştir</Text>
            </View>
            <Icon as={ChevronLeftIcon} size={20} className="rotate-180 text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            className="mt-2 flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <Icon as={ArrowRightStartOnRectangleIcon} size={20} className="text-foreground" />
              <Text className="font-medium text-foreground">Çıkış Yap</Text>
            </View>
            <Icon as={ChevronLeftIcon} size={20} className="rotate-180 text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            {isDeleting ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <Icon as={TrashIcon} size={20} className="text-red-500" />
                <Text className="font-medium text-red-500">Hesabı Sil</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
