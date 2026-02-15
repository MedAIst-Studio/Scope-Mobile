import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useDeleteAccount, useUpdateUserDetails, useUserDetails } from '@/features/users/hooks';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Key, LogOut, Trash2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
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
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center gap-4 px-4 pb-8 pt-4">
            <Button variant="ghost" size="icon" onPress={() => router.back()} className="-ml-2">
              <Icon as={ChevronLeft} size={28} className="text-foreground" />
            </Button>
            <Text className="text-3xl font-bold tracking-tight text-foreground">Profil</Text>
          </View>

          <View className="flex-1 px-4">
            {/* Avatar Area */}
            <View className="mb-10 items-center">
              <View className="relative">
                <View className="h-28 w-28 items-center justify-center rounded-[2.5rem] border-4 border-background bg-secondary shadow-md">
                  <Icon as={User} size={56} className="text-muted-foreground/40" />
                </View>
                <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary">
                  <View className="h-2 w-2 animate-pulse rounded-full bg-white" />
                </View>
              </View>
              <Text className="mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                {user?.email}
              </Text>
            </View>

            {/* Inputs */}
            <View className="gap-6">
              <View>
                <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  Kullanıcı Bilgileri
                </Text>
                <Card className="gap-4 rounded-3xl p-4">
                  <View>
                    <Input
                      className="border-border/20 bg-card/50"
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Kullanıcı Adı"
                    />
                  </View>
                  <Button onPress={handleUpdate} disabled={isUpdating || !username.trim() || username === user?.username} className="w-full">
                    {isUpdating ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="font-bold text-primary-foreground">Bilgileri Güncelle</Text>
                    )}
                  </Button>
                </Card>
              </View>

              <View>
                <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  Güvenlik & Oturum
                </Text>
                <Card className="gap-1 rounded-3xl p-2">
                  <TouchableOpacity
                    onPress={() => router.push('/(app)/profile/password')}
                    className="flex-row items-center justify-between rounded-2xl bg-card p-4 active:bg-secondary/50">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon as={Key} size={20} className="text-primary" />
                      </View>
                      <Text className="font-bold text-foreground">Şifreyi Değiştir</Text>
                    </View>
                    <Icon as={ChevronRight} size={20} className="text-muted-foreground/40" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={logout}
                    className="flex-row items-center justify-between rounded-2xl bg-card p-4 active:bg-secondary/50">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <Icon as={LogOut} size={20} className="text-muted-foreground" />
                      </View>
                      <Text className="font-bold text-foreground">Çıkış Yap</Text>
                    </View>
                    <Icon as={ChevronRight} size={20} className="text-muted-foreground/40" />
                  </TouchableOpacity>
                </Card>
              </View>

              <Button
                variant="ghost"
                onPress={handleDelete}
                disabled={isDeleting}
                className="h-14 flex-row items-center justify-center">
                {isDeleting ? (
                  <ActivityIndicator color="#EF4444" />
                ) : (
                  <>
                    <Icon as={Trash2} size={20} className="mr-2 text-destructive/40" />
                    <Text className="font-bold text-destructive/40">Hesabı Sil</Text>
                  </>
                )}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
