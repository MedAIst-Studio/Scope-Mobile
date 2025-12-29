import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

export interface ActionItem {
  label: string;
  icon: any;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

interface ActionMenuProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionItem[];
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ isVisible, onClose, title, actions }) => {
  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="absolute inset-0 bg-black/40"
          />
        </Pressable>

        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className="rounded-t-[32px] bg-card px-6 pb-12 pt-6 shadow-2xl">
          <View className="mb-6 h-1 w-12 self-center rounded-full bg-border" />

          {title && (
            <Text className="mb-6 text-center text-lg font-bold text-foreground">{title}</Text>
          )}

          <View className="gap-3">
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  setTimeout(action.onPress, 300);
                }}
                className={cn(
                  'flex-row items-center gap-4 rounded-2xl p-4',
                  action.variant === 'destructive'
                    ? 'border border-destructive/20 bg-destructive/10'
                    : 'border border-border/10 bg-secondary/40'
                )}>
                <View
                  className={cn(
                    'h-12 w-12 items-center justify-center rounded-xl',
                    action.variant === 'destructive' ? 'bg-destructive/20' : 'bg-primary/10'
                  )}>
                  <Icon
                    as={action.icon}
                    size={24}
                    className={
                      action.variant === 'destructive' ? 'text-destructive' : 'text-primary'
                    }
                  />
                </View>
                <Text
                  className={cn(
                    'text-base font-semibold',
                    action.variant === 'destructive' ? 'text-destructive' : 'text-foreground'
                  )}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
