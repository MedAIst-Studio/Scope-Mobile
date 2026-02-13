import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  title?: string;
  onHide: () => void;
  duration?: number;
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle2,
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        iconColor: 'text-green-500',
        textColor: 'text-green-700 dark:text-green-400',
      };
    case 'error':
      return {
        icon: AlertCircle,
        bg: 'bg-destructive/10',
        border: 'border-destructive/20',
        iconColor: 'text-destructive',
        textColor: 'text-destructive dark:text-red-400',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        iconColor: 'text-orange-500',
        textColor: 'text-orange-700 dark:text-orange-400',
      };
    case 'info':
    default:
      return {
        icon: Info,
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        iconColor: 'text-primary',
        textColor: 'text-primary dark:text-blue-400',
      };
  }
};

export const Toast: React.FC<ToastProps> = ({ message, type, title, onHide, duration = 4000 }) => {
  const config = getToastConfig(type);
  const progress = useSharedValue(100);

  useEffect(() => {
    progress.value = withTiming(0, { duration });
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [duration, onHide]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp}
      className="absolute left-4 right-4 top-14 z-50">
      <View
        className={cn(
          'overflow-hidden rounded-2xl border bg-card/95 shadow-lg backdrop-blur-md',
          config.border
        )}>
        <View className="flex-row items-center p-4">
          <View className={cn('mr-3 h-10 w-10 items-center justify-center rounded-xl', config.bg)}>
            <Icon as={config.icon} size={24} className={config.iconColor} />
          </View>
          <View className="flex-1">
            {title && <Text className="mb-0.5 text-sm font-bold text-foreground">{title}</Text>}
            <Text
              className={cn(
                'text-sm font-medium leading-tight',
                !title && 'py-1',
                'text-muted-foreground'
              )}>
              {message}
            </Text>
          </View>
          <View className="h-full pl-2">
            <Icon as={X} size={16} className="text-muted-foreground/50" onPress={onHide} />
          </View>
        </View>
        {/* Progress Bar */}
        <Animated.View
          style={progressStyle}
          className={cn('h-1 w-full', config.bg.replace('/10', '/30'))}
        />
      </View>
    </Animated.View>
  );
};
