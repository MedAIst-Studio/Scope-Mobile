import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
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
            <Text className="mr-2 text-sm text-muted-foreground">{value}</Text>
            {showArrow && <Icon as={ChevronRightIcon} size={20} color="#9CA3AF" />}
          </View>
        );
      default:
        return showArrow ? <Icon as={ChevronRightIcon} size={20} color="#9CA3AF" /> : null;
    }
  };

  const Component = type === 'switch' ? View : TouchableOpacity;

  return (
    <Component
      onPress={type !== 'switch' ? onPress : undefined}
      className="flex-row items-center px-1 py-4">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
        <SettingIcon size={20} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-medium text-foreground">{title}</Text>
        {subtitle && <Text className="mt-0.5 text-sm text-muted-foreground">{subtitle}</Text>}
      </View>
      {renderValue()}
    </Component>
  );
};
