import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, UserIcon } from 'react-native-heroicons/outline';
import { UserProfile } from '../types';

interface AccountSectionProps {
  profile: UserProfile;
  onPress: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ profile, onPress }) => (
  <TouchableOpacity onPress={onPress} className="mb-6 flex-row items-center px-1 py-4">
    <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-muted">
      {profile.photo ? <Text>📷</Text> : <Icon as={UserIcon} size={20} color="#6B7280" />}
    </View>
    <View className="flex-1">
      <Text className="text-lg font-semibold text-foreground">{profile.name}</Text>
      <Text className="text-sm text-muted-foreground">Profil Bilgileri</Text>
    </View>
    <Icon as={ChevronRightIcon} size={24} color="#9CA3AF" />
  </TouchableOpacity>
);
