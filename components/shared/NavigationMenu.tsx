import { mockChats } from '@/features/chat/utils/mockChats';
import { cn } from '@/lib/utils';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Portal } from '@rn-primitives/portal';
import {
  Brain,
  FileText,
  History,
  Menu,
  MessageCircle,
  MessageSquarePlus,
  Settings,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui/icon';

export function NavigationSheet({ state, descriptors, navigation }: BottomTabBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const insets = useSafeAreaInsets();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <View className="absolute left-6 z-50" style={{ top: Math.max(insets.top + 10, 20) }}>
        <TouchableOpacity
          onPress={toggleMenu}
          className="h-10 w-10 items-center justify-center active:opacity-70">
          <Icon as={Menu} size={20} className="text-foreground" />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <Portal name="navigation-portal">
          {/* Backdrop */}
          <Pressable onPress={closeMenu} className="absolute inset-0 z-40">
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="absolute inset-0 bg-black/40"
            />
          </Pressable>

          {/* Sidebar Drawer */}
          <Animated.View
            entering={SlideInLeft.duration(300)}
            exiting={SlideOutLeft.duration(300)}
            className="absolute bottom-0 left-0 top-0 z-50 w-[80%] max-w-[320px] border-r border-border bg-card shadow-2xl"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View className="flex-1">
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-border p-4">
                <Text className="text-xl font-bold text-foreground">MedAIst</Text>
                <TouchableOpacity onPress={closeMenu} className="p-1">
                  <Icon as={X} size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 24 }}>
                {/* Main Navigation */}
                <View className="gap-2">
                  <Text className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                    Menü
                  </Text>
                  {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.title || route.name;

                    if (route.name === '(settings)/profile') return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                      const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                      });
                      if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                      }
                      closeMenu();
                    };

                    let MenuIcon = MessageCircle;
                    if (route.name === 'index') MenuIcon = MessageCircle;
                    else if (route.name === 'files') MenuIcon = FileText;
                    else if (route.name === 'quiz') MenuIcon = Brain;
                    else if (route.name.includes('settings')) MenuIcon = Settings;

                    return (
                      <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        className={cn(
                          'flex-row items-center gap-3 rounded-md px-3 py-2 transition-colors',
                          isFocused ? 'bg-primary/10' : 'active:bg-secondary'
                        )}>
                        <Icon
                          as={MenuIcon}
                          size={20}
                          className={isFocused ? 'text-primary' : 'text-muted-foreground'}
                          color={isFocused ? undefined : 'gray'}
                        />
                        <Text
                          className={cn(
                            'text-sm font-medium',
                            isFocused ? 'text-primary' : 'text-foreground'
                          )}>
                          {label as string}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Chat History Section */}
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase text-muted-foreground">
                      Geçmiş Sohbetler
                    </Text>
                    <TouchableOpacity>
                      <Icon as={MessageSquarePlus} size={16} className="text-primary" />
                    </TouchableOpacity>
                  </View>

                  {mockChats.map((chat) => (
                    <TouchableOpacity
                      key={chat.id}
                      className="flex-row items-center gap-3 rounded-md border border-transparent px-3 py-2 hover:border-border active:bg-secondary">
                      <Icon as={History} size={16} className="text-muted-foreground" color="gray" />
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                          {chat.title}
                        </Text>
                        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                          {chat.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="border-t border-border p-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <Text className="text-xs font-bold text-primary">ÖF</Text>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground">Ömer Faruk</Text>
                    <Text className="text-xs text-muted-foreground">Pro Plan</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </Portal>
      )}
    </>
  );
}
