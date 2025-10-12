import { useState } from 'react';
import { SettingsData, Theme } from '../types';
import { mockUserProfile } from '../utils/mockData';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>(mockUserProfile);

  const updateProfile = (updates: Partial<SettingsData['profile']>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const toggleNotifications = () => {
    setSettings((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  return {
    settings,
    updateProfile,
    updateTheme,
    toggleNotifications,
  };
};
