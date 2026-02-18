import { userAPI } from '@/features/users/api';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
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

  const updateTheme = useCallback(
    async (theme: Theme) => {
      const previousTheme = settings.theme;

      setSettings((prev) => ({ ...prev, theme }));
      setColorScheme(theme);

      const { error } = await userAPI.updatePreferences({ theme });

      if (error) {
        setSettings((prev) => ({ ...prev, theme: previousTheme }));
        setColorScheme(previousTheme);
        Alert.alert('Hata', 'Tema güncellenirken bir sorun oluştu.');
      }
    },
    [settings.theme, setColorScheme],
  );

  const toggleNotifications = useCallback(
    async (key: keyof SettingsData['notifications']) => {
      const previousValue = settings.notifications[key];
      const newValue = !previousValue;

      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: newValue,
        },
      }));

      const { error } = await userAPI.updatePreferences({
        notifications: { [key]: newValue },
      });

      if (error) {
        setSettings((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [key]: previousValue,
          },
        }));
        Alert.alert('Hata', 'Bildirim ayarları güncellenirken bir sorun oluştu.');
      }
    },
    [settings.notifications],
  );

  return {
    settings,
    updateProfile,
    updateTheme,
    toggleNotifications,
  };
};
