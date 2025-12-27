import { useChats } from '@/features/chat/hooks';
import { useUserDetails } from '@/features/users/hooks';
import { cn } from '@/lib/utils';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Portal } from '@rn-primitives/portal';
import React from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  AcademicCapIcon,
  Bars3Icon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui/icon';

export function CustomHeader({ layout, options, route, navigation }: BottomTabHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const insets = useSafeAreaInsets();
  const { data: chats } = useChats();
  const { data: user } = useUserDetails();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Header Title Logic
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : route.name;

  return (
    <>
      {/* Top Header Bar */}
      <View
        className="flex-row items-center justify-between border-b border-border bg-background px-4 pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) }}>
        {/* Left: Menu Trigger */}
        <TouchableOpacity onPress={toggleMenu} className="h-10 w-10 items-center justify-center">
          <Icon as={Bars3Icon} size={24} className="text-foreground" />
        </TouchableOpacity>

        {/* Center: Title */}
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {typeof title === 'string' ? title : route.name}
          </Text>
        </View>

        {/* Right: Dynamic Actions */}
        <View className="h-10 w-10 items-center justify-center">
          {options.headerRight ? (
            options.headerRight({ canGoBack: navigation.canGoBack() })
          ) : (
            <View className="w-6" /> // Spacer
          )}
        </View>
      </View>

      {/* Sidebar Drawer (Portal) */}
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

          {/* Sidebar Content */}
          <Animated.View
            entering={SlideInLeft.duration(300)}
            exiting={SlideOutLeft.duration(300)}
            className="absolute bottom-0 left-0 top-0 z-50 w-[80%] max-w-[320px] border-r border-border bg-card shadow-2xl"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View className="flex-1">
              {/* Sidebar Header */}
              <View className="flex-row items-center justify-between border-b border-border p-5">
                <Text className="text-xl font-bold text-foreground">MedAIst</Text>
                <TouchableOpacity onPress={closeMenu} className="-mr-2 p-2">
                  <XMarkIcon size={26} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 32 }}>
                {/* Main Navigation */}
                <View className="gap-3">
                  <Text className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground/50">
                    Menü
                  </Text>
                  {/* We need access to all tabs, but 'navigation' prop here is for the CURRENT tab. 
                        However, we can look at the parent navigation state if we passed it, or just hardcode links 
                        since we know our app structure. 
                        Actually, BottomTabHeaderProps gives us `navigation` which is the Tab navigation helper.
                        We can use `navigation.navigate('screenName')`.
                    */}

                  {[
                    { name: 'index', label: 'Anasayfa', icon: HomeIcon },
                    { name: 'chat', label: 'Sohbet', icon: ChatBubbleOvalLeftIcon },
                    { name: 'scan', label: 'Soru Tarat', icon: CameraIcon },
                    { name: 'files', label: 'Dosyalar', icon: DocumentTextIcon },
                    { name: 'quiz', label: 'Quiz', icon: AcademicCapIcon },
                    { name: '(settings)/settings', label: 'Ayarlar', icon: Cog6ToothIcon },
                  ].map((item) => {
                    // Check active state... simplistic approach: check route.name
                    const isFocused =
                      route.name === item.name || (route.name === 'index' && item.name === 'index');
                    // Note: route.name in HeaderProps is the CURRENT route.

                    return (
                      <TouchableOpacity
                        key={item.name}
                        onPress={() => {
                          navigation.navigate(item.name as never);
                          closeMenu();
                        }}
                        className={cn(
                          'flex-row items-center gap-4 rounded-lg px-4 py-3 transition-colors',
                          isFocused ? 'bg-primary/10' : 'active:bg-secondary'
                        )}>
                        <Icon
                          as={item.icon}
                          size={24}
                          className={isFocused ? 'text-primary' : 'text-muted-foreground'}
                        />
                        <Text
                          className={cn(
                            'text-base font-semibold',
                            isFocused ? 'text-primary' : 'text-foreground'
                          )}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Chat History Section */}
                <View className="gap-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground/50">
                      Geçmiş Sohbetler
                    </Text>
                    <TouchableOpacity className="-mr-2 p-2">
                      <ChatBubbleLeftRightIcon size={20} color="#F97316" />
                    </TouchableOpacity>
                  </View>

                  {chats?.map((chat) => (
                    <TouchableOpacity
                      key={chat.id}
                      onPress={() => {
                        navigation.navigate('chat', { id: chat.id, file_id: chat.file_id });
                        closeMenu();
                      }}
                      className="flex-row items-center gap-4 rounded-lg border border-transparent px-4 py-2 hover:border-border active:bg-secondary">
                      <ClockIcon size={20} color="#6B7280" />
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                          {chat.title || 'Yeni Sohbet'}
                        </Text>
                        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                          {new Date(chat.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="border-t border-border p-5">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Text className="text-sm font-bold text-primary">
                      {user?.username?.substring(0, 2).toUpperCase() || 'TR'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-foreground">
                      {user?.username || 'Misafir'}
                    </Text>
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
