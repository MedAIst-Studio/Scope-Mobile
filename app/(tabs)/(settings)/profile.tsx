import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UpgradeButton } from '@/features/subscription/components/UpgradeButton';
import { Text } from '@/components/ui/text';
import { useSubscription } from '@/features/subscription/context/SubscriptionContext';

const ProfileScreen = () => {
  const { tier, usage } = useSubscription();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
        <Text className="text-3xl font-bold text-foreground mb-5 self-start px-6">Profil</Text>

        <UpgradeButton />

        <View className="w-[90%] bg-muted/20 rounded-3xl p-6 mb-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Kullanım Özeti</Text>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-muted-foreground">Mesajlaşma</Text>
            <Text className="text-foreground font-bold">{tier === 'PRO' ? 'Sınırsız' : `${usage.chatMessages} / 3`}</Text>
          </View>
          <View className="h-1.5 w-full bg-muted rounded-full mb-6 overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: tier === 'PRO' ? '100%' : `${Math.min((usage.chatMessages / 3) * 100, 100)}%` }}
            />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-muted-foreground">Dosya Yükleme</Text>
            <Text className="text-foreground font-bold">{tier === 'PRO' ? 'Sınırsız' : `${usage.fileUploads} / 5`}</Text>
          </View>
          <View className="h-1.5 w-full bg-muted rounded-full mb-6 overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: tier === 'PRO' ? '100%' : `${Math.min((usage.fileUploads / 5) * 100, 100)}%` }}
            />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-muted-foreground">Tarama</Text>
            <Text className="text-foreground font-bold">{tier === 'PRO' ? 'Sınırsız' : `${usage.scans} / 5`}</Text>
          </View>
          <View className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: tier === 'PRO' ? '100%' : `${Math.min((usage.scans / 5) * 100, 100)}%` }}
            />
          </View>
        </View>

        <View className="w-[90%] p-4 bg-muted/20 rounded-2xl mb-3 border border-border">
          <Text className="text-foreground font-semibold">Hesap Ayarları</Text>
        </View>
        <View className="w-[90%] p-4 bg-muted/20 rounded-2xl mb-3 border border-border">
          <Text className="text-foreground font-semibold">Yardım ve Destek</Text>
        </View>
        <View className="w-[90%] p-4 bg-muted/20 rounded-2xl mb-3 border border-border">
          <Text className="text-foreground font-semibold text-destructive">Çıkış Yap</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
