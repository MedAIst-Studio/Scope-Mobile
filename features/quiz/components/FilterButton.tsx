import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ label, isSelected, onPress }) => (
  <Button
    variant={isSelected ? 'default' : 'outline'}
    size="sm"
    onPress={onPress}
    className={`mr-2 rounded-full ${isSelected ? 'bg-primary' : 'border-input bg-background'}`}>
    <Text
      className={`text-xs font-medium ${
        isSelected ? 'text-primary-foreground' : 'text-foreground'
      }`}>
      {label}
    </Text>
  </Button>
);
