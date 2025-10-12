import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { Bell, ChevronLeft, HelpCircle, Palette } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { AccountSection } from './AccountSection';
import { SettingsItem } from './SettingsItem';
import { ThemeSelector } from './ThemeSelector';

export const SettingsScreen: React.FC = () => {
  const { settings, updateTheme, toggleNotifications } = useSettings();

  const handleAccountPress = () => {
    router.push('/profile');
  };

  const handleHelpPress = () => {
    // TODO: Navigate to help screen
    console.log('Help pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 pb-6 pt-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 flex-row items-center gap-4">
          <Icon as={ChevronLeft} size={24} className="text-foreground" />
          <Text className="text-2xl font-bold text-foreground">Ayarlar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Account Section */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-foreground">Hesap</Text>
          <AccountSection profile={settings.profile} onPress={handleAccountPress} />
        </View>

        {/* Settings Section */}
        <View>
          <Text className="mb-4 text-xl font-semibold text-foreground">Seçenekler</Text>

          {/* Theme Setting with Custom Selector */}
          <View className="flex-row items-center px-1 py-4">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
              <Icon as={Palette} size={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-foreground">Tema</Text>
            </View>
            <ThemeSelector selectedTheme={settings.theme} onThemeChange={updateTheme} />
          </View>

          <SettingsItem
            icon={Bell}
            title="Bildirimler"
            type="switch"
            value={settings.notifications}
            onPress={toggleNotifications}
            showArrow={false}
          />

          {/* Help */}
          <SettingsItem icon={HelpCircle} title="Destek" onPress={handleHelpPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
