import { CustomHeader } from '@/components/shared/CustomHeader';
import { Icon } from '@/components/ui/icon';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { CameraIcon } from 'react-native-heroicons/outline';

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Sohbet',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/(tabs)/scan')}>
              <Icon as={CameraIcon} size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Soru Tarat',
          headerShown: false,
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Dosyalarım',
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Sınavlarım',
        }}
      />
      <Tabs.Screen
        name="(settings)/settings"
        options={{
          title: 'Ayarlar',
        }}
      />
      <Tabs.Screen
        name="(settings)/profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
