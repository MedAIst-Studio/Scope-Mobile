import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useUpdatePassword } from '@/features/users/hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChangePasswordScreen: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      await updatePassword({ oldPassword, newPassword });
      router.back();
    } catch (error) {
      // handled by hook onError
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center gap-4 px-4 pb-6 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="-ml-2 p-2">
          <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Şifre Değiştir</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <View className="flex-1 px-4">
          <View className="gap-4">
            <View>
              <Text className="mb-1.5 ml-1 text-sm font-medium text-foreground">Mevcut Şifre</Text>
              <TextInput
                className="rounded-lg border border-border bg-card px-4 py-3 text-foreground"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="********"
                placeholderTextColor="#6B7280"
                secureTextEntry
              />
            </View>

            <View>
              <Text className="mb-1.5 ml-1 text-sm font-medium text-foreground">Yeni Şifre</Text>
              <TextInput
                className="rounded-lg border border-border bg-card px-4 py-3 text-foreground"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="********"
                placeholderTextColor="#6B7280"
                secureTextEntry
              />
            </View>

            <View>
              <Text className="mb-1.5 ml-1 text-sm font-medium text-foreground">
                Yeni Şifre (Tekrar)
              </Text>
              <TextInput
                className="rounded-lg border border-border bg-card px-4 py-3 text-foreground"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="********"
                placeholderTextColor="#6B7280"
                secureTextEntry
              />
            </View>

            <Button onPress={handleUpdate} disabled={isPending} className="mt-4 bg-primary">
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-semibold text-primary-foreground">Şifreyi Güncelle</Text>
              )}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
