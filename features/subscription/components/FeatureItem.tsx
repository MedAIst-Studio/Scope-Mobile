import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Check } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface FeatureItemProps {
    label: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ label }) => {
    return (
        <View className="flex-row items-center space-x-3 py-1.5">
            <View className="h-5 w-5 items-center mr-2 justify-center rounded-full bg-primary/20">
                <Icon as={Check} size={12} className="text-primary" strokeWidth={3} />
            </View>
            <Text className="text-[15px] font-medium text-foreground">
                {label}
            </Text>
        </View>
    );
};
