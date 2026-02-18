import { CustomHeader } from '@/components/shared/CustomHeader';
import { Icon } from '@/components/ui/icon';
import { registerForPushNotificationsAsync } from '@/features/notifications/utils';
import { Tabs, useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const TabsLayout = () => {
  const router = useRouter();
  registerForPushNotificationsAsync()

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
              <Icon as={Camera} size={24} className="text-foreground" />
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
