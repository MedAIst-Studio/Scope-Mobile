import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useUpdatePassword } from '@/features/users/hooks';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChangePasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updatePasswordMutation = useUpdatePassword();

  const handleUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    updatePasswordMutation.mutate(
      { oldPassword: currentPassword, newPassword },
      {
        onSuccess: () => {
          // Success alert is handled in the hook, we just navigate back
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 pb-6 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 flex-row items-center gap-4">
          <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
          <Text className="text-2xl font-bold text-foreground">Şifreyi Değiştir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-8 items-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Icon as={LockClosedIcon} size={48} className="text-primary" />
          </View>
          <Text className="text-center text-muted-foreground">
            Hesabınızın güvenliği için güçlü bir şifre seçin.
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Mevcut Şifre</Text>
            <Input
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="••••••••"
              className="border-border bg-card text-foreground"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Yeni Şifre</Text>
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
              className="border-border bg-card text-foreground"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Yeni Şifre (Tekrar)</Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
              className="border-border bg-card text-foreground"
            />
          </View>

          <Button
            onPress={handleUpdate}
            className="mt-6"
            disabled={updatePasswordMutation.isPending}>
            <Text className="font-semibold text-primary-foreground">
              {updatePasswordMutation.isPending ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
