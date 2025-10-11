import { Tabs } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="files" options={{ title: 'Dosyalar' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
    </Tabs>
  );
};

export default TabsLayout;
