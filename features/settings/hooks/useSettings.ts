import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { SettingsData, Theme } from '../types';
import { mockUserProfile } from '../utils/mockData';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>(mockUserProfile);
  const { setColorScheme } = useColorScheme();

  const updateProfile = (updates: Partial<SettingsData['profile']>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
    setColorScheme(theme);
  };

  const toggleNotifications = (key: keyof SettingsData['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return {
    settings,
    updateProfile,
    updateTheme,
    toggleNotifications,
  };
};
