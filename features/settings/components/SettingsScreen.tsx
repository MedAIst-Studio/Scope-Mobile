import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Bell, HelpCircle, Palette } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { SettingsItem } from './SettingsItem';
import { ThemeSelector } from './ThemeSelector';

export const SettingsScreen: React.FC = () => {
  const { settings, updateTheme, toggleNotifications } = useSettings();

  const handleHelpPress = () => {
    console.log('Help pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Appearance Group */}
        <View className="mb-8">
          <Text className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
            Görünüm & Deneyim
          </Text>
          <Card className="gap-1 rounded-[2.5rem] border-border/20 p-3 shadow-sm">
            <View className="flex-row items-center rounded-2xl px-2 py-3">
              <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon as={Palette} size={22} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold tracking-tight text-foreground">Tema</Text>
                <Text className="mt-0.5 text-xs font-medium text-muted-foreground/50">
                  Karanlık veya aydınlık mod
                </Text>
              </View>
              <ThemeSelector selectedTheme={settings.theme} onThemeChange={updateTheme} />
            </View>
          </Card>
        </View>

        {/* Preferences Group */}
        <View className="mb-8">
          <Text className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
            Tercihler & Güvenlik
          </Text>
          <Card className="gap-1 rounded-[2.5rem] border-border/20 p-3 shadow-sm">
            <SettingsItem
              icon={Bell}
              title="Bildirimler"
              subtitle="Anlık haber ve güncellemeler"
              type="switch"
              value={settings.notifications}
              onPress={toggleNotifications}
              showArrow={false}
            />
          </Card>
        </View>

        {/* Support Group */}
        <View className="mb-12">
          <Text className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
            Daha Fazla
          </Text>
          <Card className="gap-1 rounded-[2.5rem] border-border/20 p-3 shadow-sm">
            <SettingsItem
              icon={HelpCircle}
              title="Destek & Yardım"
              subtitle="Bize ulaşın veya SSS"
              onPress={handleHelpPress}
            />
          </Card>
        </View>

        <View className="mb-12 items-center">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">
            MedAIst Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
