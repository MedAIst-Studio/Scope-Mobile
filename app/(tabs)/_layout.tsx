import { Tabs } from 'expo-router';
import { Brain, FileText, MessageCircle } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';

const TabsLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          paddingTop: 5,
          marginBottom: 5,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: colorScheme === 'dark' ? '#171717' : '#FFFFFF',
        },
        tabBarIconStyle: {
          width: 20,
          height: 20,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sohbet',
          tabBarIcon: ({ color }) => <MessageCircle size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Dosyalar',
          tabBarIcon: ({ color }) => <FileText size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <Brain size={20} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
