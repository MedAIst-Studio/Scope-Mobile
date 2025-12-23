import { CustomHeader } from '@/components/shared/CustomHeader';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

const TabsLayout = () => {
  const colorScheme = useColorScheme();

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
          title: 'Sohbet',
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
