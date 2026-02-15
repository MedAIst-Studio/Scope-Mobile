import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { User as UserType } from '@/features/users/types';
import { router } from 'expo-router';
import { Check, ChevronLeft, Lock, LogOut, Trash2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface AccountScreenProps {
  user: UserType | undefined;
  onSave: (username: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  onSave,
  onLogout,
  onDeleteAccount,
}) => {
  const [username, setUsername] = useState(user?.username || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const isChanged = username !== user.username;
    setHasChanges(isChanged);
  }, [username, user]);

  const handleSave = () => {
    onSave(username);
    setHasChanges(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pb-6 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex flex-1 flex-row items-center justify-between">
          <Icon as={ChevronLeft} size={24} className="text-foreground" />
          <Text className="text-2xl font-bold text-foreground">Profil</Text>
          <View />
        </TouchableOpacity>
        {hasChanges && (
          <TouchableOpacity
            onPress={handleSave}
            className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Icon as={Check} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-8 items-center">
          <View className="mb-3 h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Icon as={User} size={32} color="#6B7280" />
          </View>
        </View>

        <View>
          {/* Username */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">Kullanıcı Adı</Text>
            <Input value={username} onChangeText={setUsername} className="border-border bg-card" />
          </View>

          {/* Email (Read Only) */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">E-Posta</Text>
            <Input
              value={user?.email || ''}
              className="border-border bg-card opacity-60"
              keyboardType="email-address"
              editable={false}
            />
          </View>

          {/* Action Buttons */}
          <View className="mt-12">
            {/* Change Password Button */}
            <View className="mb-4">
              <Button
                onPress={() => router.push('/(tabs)/(settings)/change-password')}
                variant="outline"
                className="flex-row items-center justify-center border-border bg-card">
                <View className="flex-row items-center">
                  <Icon as={Lock} size={16} className="text-foreground" />
                  <Text className="ml-2 font-medium text-foreground">Şifreyi Değiştir</Text>
                </View>
              </Button>
            </View>

            {/* Logout Button */}
            <View className="mb-4">
              <Button
                onPress={handleLogout}
                variant="outline"
                className="flex-row items-center justify-center border-orange-200 bg-orange-50">
                <View className="flex-row items-center">
                  <Icon as={LogOut} size={16} color="#F97316" />
                  <Text className="ml-2 font-medium text-orange-600">Çıkış Yap</Text>
                </View>
              </Button>
            </View>

            {/* Delete Account Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-row items-center justify-center border-red-200 bg-red-50">
                  <View className="flex-row items-center">
                    <Icon as={Trash2} size={16} color="#EF4444" />
                    <Text className="ml-2 font-medium text-red-600">Hesabı Sil</Text>
                  </View>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hesabı Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>İptal</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={handleDeleteAccount}>
                    <Text>Sil</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
