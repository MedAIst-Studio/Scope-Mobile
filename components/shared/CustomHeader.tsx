import { mockChats } from '@/features/chat/utils/mockChats';
import { cn } from '@/lib/utils';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
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

export function CustomHeader({ layout, options, route, navigation }: BottomTabHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const insets = useSafeAreaInsets();

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
          <Icon as={Menu} size={24} className="text-foreground" />
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
            options.headerRight({})
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
              <View className="flex-row items-center justify-between border-b border-border p-4">
                <Text className="text-xl font-bold text-foreground">MedAIst</Text>
                <TouchableOpacity onPress={closeMenu} className="p-1">
                  <X size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 24 }}>
                {/* Main Navigation */}
                <View className="gap-2">
                  <Text className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                    Menü
                  </Text>
                  {/* We need access to all tabs, but 'navigation' prop here is for the CURRENT tab. 
                        However, we can look at the parent navigation state if we passed it, or just hardcode links 
                        since we know our app structure. 
                        Actually, BottomTabHeaderProps gives us `navigation` which is the Tab navigation helper.
                        We can use `navigation.navigate('screenName')`.
                    */}

                  {[
                    { name: 'index', label: 'Sohbet', icon: MessageCircle },
                    { name: 'files', label: 'Dosyalar', icon: FileText },
                    { name: 'quiz', label: 'Quiz', icon: Brain },
                    { name: '(settings)/settings', label: 'Ayarlar', icon: Settings },
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
                          'flex-row items-center gap-3 rounded-md px-3 py-2 transition-colors',
                          isFocused ? 'bg-primary/10' : 'active:bg-secondary'
                        )}>
                        <item.icon
                          size={20}
                          className={isFocused ? 'text-primary' : 'text-muted-foreground'}
                          color={isFocused ? undefined : 'gray'}
                        />
                        <Text
                          className={cn(
                            'text-sm font-medium',
                            isFocused ? 'text-primary' : 'text-foreground'
                          )}>
                          {item.label}
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
                      <MessageSquarePlus size={16} className="text-primary" />
                    </TouchableOpacity>
                  </View>

                  {mockChats.map((chat) => (
                    <TouchableOpacity
                      key={chat.id}
                      className="flex-row items-center gap-3 rounded-md border border-transparent px-3 py-2 hover:border-border active:bg-secondary">
                      <History size={16} className="text-muted-foreground" />
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
