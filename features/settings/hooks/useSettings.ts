import { userAPI } from '@/features/users/api';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { SettingsData, Theme } from '../types';
import { mockUserProfile } from '../utils/mockData';

const DEBOUNCE_DELAY = 500;

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>(mockUserProfile);
  const { setColorScheme } = useColorScheme();

  // Refs for debounced notifications sync
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestNotificationsRef = useRef(settings.notifications);
  const preDebounceNotificationsRef = useRef(settings.notifications);
  const isFirstToggleInBatchRef = useRef(true);

  // Keep the latest notifications ref in sync with state
  useEffect(() => {
    latestNotificationsRef.current = settings.notifications;
  }, [settings.notifications]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
    (key: keyof SettingsData['notifications']) => {
      // Capture the snapshot before any changes in this debounce batch
      if (isFirstToggleInBatchRef.current) {
        preDebounceNotificationsRef.current = latestNotificationsRef.current;
        isFirstToggleInBatchRef.current = false;
      }

      // Optimistic UI update
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key],
        },
      }));

      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new debounce timer to send the full notifications state
      debounceTimerRef.current = setTimeout(async () => {
        const snapshotBeforeBatch = preDebounceNotificationsRef.current;
        const notificationsToSend = latestNotificationsRef.current;

        // Reset batch tracking
        isFirstToggleInBatchRef.current = true;

        const { error } = await userAPI.updatePreferences({
          notifications: {
            motivation: notificationsToSend.motivation,
            reminders: notificationsToSend.reminders,
            updates: notificationsToSend.updates,
          },
        });

        if (error) {
          // Rollback to the state before the entire debounce batch
          setSettings((prev) => ({
            ...prev,
            notifications: snapshotBeforeBatch,
          }));
          Alert.alert('Hata', 'Bildirim ayarları güncellenirken bir sorun oluştu.');
        }
      }, DEBOUNCE_DELAY);
    },
    [],
  );

  return {
    settings,
    updateProfile,
    updateTheme,
    toggleNotifications,
  };
};
