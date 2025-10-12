import { SettingsData } from '../types';

export const mockUserProfile: SettingsData = {
  profile: {
    name: 'David Clerisseau',
    email: 'clerisseau@gmail.com',
    photo: undefined,
  },
  theme: 'system',
  notifications: true,
};

export const themeOptions = [
  { value: 'system' as const, label: 'Sistem' },
  { value: 'light' as const, label: 'Açık' },
  { value: 'dark' as const, label: 'Koyu' },
];
