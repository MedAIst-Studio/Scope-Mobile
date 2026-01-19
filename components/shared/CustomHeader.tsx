import { ActionMenu } from '@/components/shared/ActionMenu';
import { Badge } from '@/components/ui/badge';
import { RenameModal } from '@/features/chat/components/RenameModal';
import { useUserDetails } from '@/features/users/hooks';
import { cn } from '@/lib/utils';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Portal } from '@rn-primitives/portal';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';

import { useChats, useDeleteChat, useUpdateChat } from '@/features/chat/hooks/queries';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui/icon';

export function CustomHeader({ layout, options, route, navigation }: BottomTabHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: chats } = useChats();
  const { data: user } = useUserDetails();

  const { mutate: deleteChat } = useDeleteChat();
  const { mutate: updateChat } = useUpdateChat();

  const [selectedChat, setSelectedChat] = useState<{ id: string; title: string } | null>(null);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLongPress = (chat: any) => {
    setSelectedChat({ id: chat.id, title: chat.title });
    setIsActionMenuVisible(true);
  };

  const handleDelete = () => {
    if (selectedChat) {
      deleteChat(selectedChat.id);
      setSelectedChat(null);
    }
  };

  const menuActions = [
    {
      label: 'Yeniden Adlandır',
      icon: PencilSquareIcon,
      onPress: () => {
        setIsRenameModalVisible(true);
      },
    },
    {
      label: 'Sohbeti Sil',
      icon: TrashIcon,
      variant: 'destructive' as const,
      onPress: () => {
        handleDelete();
      },
    },
  ];

  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : route.name;

  return (
    <>
      <View
        className="flex-row items-center justify-between bg-background px-4 pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) }}>
        <TouchableOpacity
          onPress={toggleMenu}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 transition-transform active:scale-95">
          <Icon as={Bars3Icon} size={24} className="text-foreground" />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-base font-bold tracking-tight text-foreground" numberOfLines={1}>
            {typeof title === 'string' ? title : route.name}
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center">
          {options.headerRight ? (
            options.headerRight({ canGoBack: navigation.canGoBack() })
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(app)/profile')}
              className="h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 active:scale-95">
              <Text className="text-sm font-bold text-primary">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isOpen && (
        <Portal name="navigation-portal">
          <Pressable onPress={closeMenu} className="absolute inset-0 z-40">
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="absolute inset-0 bg-background/80"
            />
          </Pressable>

          <Animated.View
            entering={SlideInLeft.duration(300)}
            exiting={SlideOutLeft.duration(300)}
            className="absolute bottom-0 left-0 top-0 z-50 w-[85%] max-w-[340px] rounded-r-[3rem] border-r border-border/20 bg-card shadow-2xl"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <View className="flex-1">
              <View className="flex-row items-center justify-between px-6 py-8">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                    <AcademicCapIcon size={24} color="white" />
                  </View>
                  <Text className="text-2xl font-bold tracking-tighter text-foreground">YksAI</Text>
                </View>
                <TouchableOpacity
                  onPress={closeMenu}
                  className="h-10 w-10 items-center justify-center rounded-xl bg-secondary/50">
                  <XMarkIcon size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
                <View className="gap-2">
                  <Text className="mb-2 ml-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    Navigasyon
                  </Text>

                  {[
                    { name: 'index', label: 'Anasayfa', icon: HomeIcon },
                    { name: 'chat', label: 'Asistan', icon: ChatBubbleOvalLeftIcon },
                    { name: 'scan', label: 'Soru Çöz', icon: CameraIcon },
                    { name: 'files', label: 'Dosyalarım', icon: DocumentTextIcon },
                    { name: 'quiz', label: 'Denemeler', icon: AcademicCapIcon },
                    { name: '(settings)/settings', label: 'Ayarlar', icon: Cog6ToothIcon },
                  ].map((item) => {
                    const isFocused =
                      route.name === item.name || (route.name === 'index' && item.name === 'index');

                    return (
                      <TouchableOpacity
                        key={item.name}
                        onPress={() => {
                          navigation.navigate(item.name as never);
                          closeMenu();
                        }}
                        className={cn(
                          'flex-row items-center gap-4 rounded-2xl px-5 py-4 transition-all',
                          isFocused ? 'bg-primary' : 'active:bg-secondary/50'
                        )}>
                        <Icon
                          as={item.icon}
                          size={22}
                          className={
                            isFocused ? 'text-primary-foreground' : 'text-muted-foreground'
                          }
                        />
                        <Text
                          className={cn(
                            'text-base font-bold',
                            isFocused ? 'text-primary-foreground' : 'text-foreground'
                          )}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {chats && chats.length > 0 && (
                  <View className="mt-8 gap-2">
                    <View className="mb-2 flex-row items-center justify-between px-4">
                      <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                        Sohbet Geçmişi
                      </Text>
                      <TouchableOpacity>
                        <ChatBubbleLeftRightIcon size={16} color="#F97316" />
                      </TouchableOpacity>
                    </View>

                    {chats.slice(0, 5).map((chat) => (
                      <TouchableOpacity
                        key={chat.id}
                        onPress={() => {
                          router.push({
                            pathname: '/(tabs)/chat',
                            params: { id: chat.id, file_id: chat.file_id },
                          });
                          closeMenu();
                        }}
                        onLongPress={() => handleLongPress(chat)}
                        className="flex-row items-center gap-3 rounded-2xl bg-secondary/30 px-4 py-3 active:bg-secondary/50">
                        <View className="h-8 w-8 items-center justify-center rounded-xl bg-background/50">
                          <ClockIcon size={16} color="#94a3b8" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                            {chat.title || 'Yeni Soru Çözümü'}
                          </Text>
                          <Text className="text-[10px] font-medium text-muted-foreground/50">
                            {new Date(chat.created_at).toLocaleDateString('tr-TR')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>

              <View className="px-6 py-2">
                <TouchableOpacity
                  onPress={() => {
                    router.push('/(app)/profile');
                    closeMenu();
                  }}
                  className="flex-row items-center gap-4 rounded-[2rem] bg-secondary/40 p-4 active:scale-[0.98]">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-sm shadow-primary/30">
                    <Text className="text-sm font-bold text-primary-foreground">
                      {user?.username?.substring(0, 1).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                      {user?.username || 'Kullanıcı'}
                    </Text>
                    <Badge variant="default" className="mt-1 h-5 self-start border-0 bg-primary/10">
                      <Text className="text-[9px] font-bold uppercase tracking-tighter text-primary">
                        PREMIUM PLAN
                      </Text>
                    </Badge>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Portal>
      )}

      <ActionMenu
        isVisible={isActionMenuVisible}
        onClose={() => setIsActionMenuVisible(false)}
        title={selectedChat ? selectedChat.title : 'Sohbet Seçenekleri'}
        actions={menuActions}
      />

      <RenameModal
        isVisible={isRenameModalVisible}
        onClose={() => setIsRenameModalVisible(false)}
        initialTitle={selectedChat?.title || ''}
        onRename={(newTitle) => {
          if (selectedChat) {
            updateChat({ chatId: selectedChat.id, title: newTitle });
            setSelectedChat(null);
          }
        }}
      />
    </>
  );
}
