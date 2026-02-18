export type Theme = 'system' | 'light' | 'dark';

export interface UserProfile {
  name: string;
  email: string;
  photo?: string;
}

export interface SettingsData {
  profile: UserProfile;
  theme: Theme;
  notifications: {
    motivation: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

export interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  showArrow?: boolean;
  type?: 'navigation' | 'switch' | 'select';
}
