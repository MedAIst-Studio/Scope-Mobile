import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { User } from '@/features/users/types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, UserIcon } from 'react-native-heroicons/solid';

interface AccountSectionProps {
  user: User | undefined;
  onPress?: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ user, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card className="flex-row items-center rounded-3xl border-border/20 p-4 shadow-sm transition-colors active:bg-secondary/50">
      <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-sm">
        <Icon as={UserIcon} size={28} className="text-muted-foreground/40" />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold tracking-tight text-foreground">
          {user?.username || 'Giriş Yap'}
        </Text>
        <Text className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {user ? 'Profil Bilgilerini Düzenle' : 'Lütfen oturum açın'}
        </Text>
      </View>
      <Icon as={ChevronRightIcon} size={20} className="text-muted-foreground/30" />
    </Card>
  </TouchableOpacity>
);
