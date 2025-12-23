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
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  CheckIcon,
  ChevronLeftIcon,
  TrashIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import { UserProfile } from '../types';

interface AccountScreenProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  profile: initialProfile,
  onSave,
  onLogout,
  onDeleteAccount,
}) => {
  const [profile, setProfile] = useState(initialProfile);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('28');
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const isChanged =
      profile.name !== initialProfile.name || profile.email !== initialProfile.email;
    setHasChanges(isChanged);
  }, [profile, initialProfile]);

  const handleSave = () => {
    onSave(profile);
    setHasChanges(false);
    router.back();
  };

  const handleUploadImage = () => {
    // TODO: Implement image picker
    console.log('Upload image pressed');
  };

  const handleLogout = () => {
    onLogout();
    router.push('/(auth)/login');
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    router.push('/(auth)/signup');
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-6 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex flex-1 flex-row items-center justify-between">
          <Icon as={ChevronLeftIcon} size={24} className="text-foreground" />
          <Text className="text-2xl font-bold text-foreground">Profil</Text>
          <View />
        </TouchableOpacity>
        {hasChanges && (
          <TouchableOpacity
            onPress={handleSave}
            className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Icon as={CheckIcon} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Profile Photo */}
        <View className="mb-8 items-center">
          <View className="mb-3 h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Icon as={UserIcon} size={32} color="#6B7280" />
          </View>
          <TouchableOpacity onPress={handleUploadImage}>
            <Text className="text-base font-medium text-blue-500">Resim Yükle</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View>
          {/* Name */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">İsim</Text>
            <Input
              value={profile.name}
              onChangeText={(text) => setProfile((prev) => ({ ...prev, name: text }))}
              className="border-border bg-card"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">E-Posta</Text>
            <Input
              value={profile.email}
              onChangeText={(text) => setProfile((prev) => ({ ...prev, email: text }))}
              className="border-border bg-card"
              keyboardType="email-address"
            />
          </View>

          {/* Action Buttons */}
          <View className="mt-12">
            {/* Logout Button */}
            <View className="mb-4">
              <Button
                onPress={handleLogout}
                variant="outline"
                className="flex-row items-center justify-center border-orange-200 bg-orange-50">
                <View className="flex-row items-center">
                  <Icon as={ArrowRightOnRectangleIcon} size={16} color="#F97316" />
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
                    <Icon as={TrashIcon} size={16} color="#EF4444" />
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
