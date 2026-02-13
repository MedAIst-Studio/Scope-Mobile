import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SettingsItemProps } from '../types';

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon: SettingIcon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  type = 'navigation',
}) => {
  const renderValue = () => {
    switch (type) {
      case 'switch':
        return <Switch checked={value as boolean} onCheckedChange={() => onPress?.()} />;
      case 'select':
        return (
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm font-bold text-primary">{value}</Text>
            {showArrow && <Icon as={ChevronRight} size={18} className="text-muted-foreground/30" />}
          </View>
        );
      default:
        return showArrow ? (
          <Icon as={ChevronRight} size={18} className="text-muted-foreground/30" />
        ) : null;
    }
  };

  const Component = type === 'switch' ? View : TouchableOpacity;

  return (
    <Component
      onPress={type !== 'switch' ? onPress : undefined}
      className="flex-row items-center rounded-2xl px-2 py-3 transition-colors active:bg-secondary/40">
      <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-secondary/50">
        <Icon as={SettingIcon} size={22} className="text-muted-foreground/60" />
      </View>
      <View className="flex-1">
        <Text className="text-[17px] font-bold tracking-tight text-foreground">{title}</Text>
        {subtitle && (
          <Text className="mt-0.5 text-xs font-medium text-muted-foreground/50">{subtitle}</Text>
        )}
      </View>
      <View className="ml-2">{renderValue()}</View>
    </Component>
  );
};
