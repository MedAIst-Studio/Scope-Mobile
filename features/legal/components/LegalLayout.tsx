import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeftIcon, CheckCircleIcon, ShieldCheckIcon } from 'react-native-heroicons/solid';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: any;
  onReadComplete?: () => void;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  children,
  title,
  subtitle,
  icon: IconComponent = ShieldCheckIcon,
  onReadComplete,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isAtBottom) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      setIsAtBottom(true);
    }
  };

  const handleAccept = () => {
    if (onReadComplete) {
      onReadComplete();
      setIsAccepted(true);
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-border/40 px-4 pb-4 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 active:bg-secondary">
          <Icon as={ArrowLeftIcon} size={20} className="text-foreground" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{title}</Text>
          {subtitle && <Text className="text-xs text-muted-foreground">{subtitle}</Text>}
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon as={IconComponent} size={24} className="text-primary" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {/* Title Section */}
        <View className="mb-8">
          <Text className="mb-2 text-3xl font-bold tracking-tight text-foreground">{title}</Text>
          <Text className="text-base text-muted-foreground/80">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>

        {/* Content */}
        <View className="gap-6">{children}</View>

        {/* Footer info */}
        <View className="mt-12 items-center border-t border-border/20 pt-8">
          <Text className="text-center text-xs text-muted-foreground/40">
            © 2024 YKS Asistanın. Tüm hakları saklıdır.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      {onReadComplete && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-border/10 bg-background/80 px-6 backdrop-blur-xl"
          style={{ paddingBottom: insets.bottom + 20, paddingTop: 20 }}>
          <Button
            onPress={handleAccept}
            disabled={!isAtBottom}
            className={cn(
              'h-14 w-full flex-row items-center justify-center rounded-2xl shadow-xl',
              isAtBottom ? 'bg-primary shadow-primary/30' : 'bg-muted shadow-none'
            )}>
            <Icon
              as={isAccepted ? CheckCircleIcon : IconComponent}
              size={24}
              className={isAtBottom ? 'mr-2 text-white' : 'mr-2 text-muted-foreground'}
            />
            <Text
              className={cn(
                'text-lg font-bold',
                isAtBottom ? 'text-white' : 'text-muted-foreground'
              )}>
              {isAtBottom ? 'Okudum, Anladım & Kabul Ediyorum' : 'Okumaya Devam Et'}
            </Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View className="mb-2">
    <Text className="mb-3 text-lg font-bold text-foreground">{title}</Text>
    <View className="gap-3">{children}</View>
  </View>
);

export const LegalText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Text className={`text-[15px] leading-relaxed text-muted-foreground ${className}`}>
    {children}
  </Text>
);

export const LegalBullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="flex-row gap-3 pl-2">
    <View className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60" />
    <Text className="flex-1 text-[15px] leading-relaxed text-muted-foreground">{children}</Text>
  </View>
);
