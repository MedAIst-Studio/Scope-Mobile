import { AuthAPI } from '@/features/auth/api';
import { handleLogout } from '@/features/auth/utils';
import { AccountScreen } from '@/features/settings';
import { useDeleteAccount, useUpdateUserDetails, useUserDetails } from '@/features/users/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const ProfileScreen = () => {
  const { data: user, isLoading } = useUserDetails();
  const updateUserDetails = useUpdateUserDetails();
  const deleteAccount = useDeleteAccount();
  const router = useRouter();

  const handleSave = (username: string) => {
    updateUserDetails.mutate(username);
  };

  const handleLogoutPress = async () => {
    await AuthAPI.logout();
    await handleLogout();
  };

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AccountScreen
      user={user}
      onSave={handleSave}
      onLogout={handleLogoutPress}
      onDeleteAccount={handleDeleteAccount}
    />
  );
};

export default ProfileScreen;
