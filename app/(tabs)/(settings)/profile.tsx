import { AccountScreen, useSettings } from '@/features/settings';
import React from 'react';

const ProfileScreen = () => {
  const { settings, updateProfile } = useSettings();

  const handleSave = (updatedProfile: typeof settings.profile) => {
    updateProfile(updatedProfile);
  };

  const handleLogout = () => {
    // TODO: Clear user session/tokens
    console.log('User logged out');
  };

  const handleDeleteAccount = () => {
    // TODO: Delete user account from backend
    console.log('Account deleted');
  };

  return (
    <AccountScreen
      profile={settings.profile}
      onSave={handleSave}
      onLogout={handleLogout}
      onDeleteAccount={handleDeleteAccount}
    />
  );
};

export default ProfileScreen;
