import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export type SubscriptionInterval = 'MONTHLY' | 'THREE_MONTH' | 'ANNUAL';

interface IntervalSwitcherProps {
    activeInterval: SubscriptionInterval;
    onIntervalChange: (interval: SubscriptionInterval) => void;
}

const INTERVAL_ITEMS: { label: string; value: SubscriptionInterval }[] = [
    { label: 'Aylık', value: 'MONTHLY' },
    { label: 'Dönemlik', value: 'THREE_MONTH' },
    { label: 'Yıllık', value: 'ANNUAL' },
];

export const IntervalSwitcher: React.FC<IntervalSwitcherProps> = ({
    activeInterval,
    onIntervalChange,
}) => {
    const activeIndex = INTERVAL_ITEMS.findIndex(i => i.value === activeInterval);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withSpring(activeIndex * 80, {
                        damping: 20,
                        stiffness: 150,
                    }),
                },
            ],
        };
    }, [activeIndex]);

    return (
        <View className="mb-6 self-center">
            <View className="relative h-10 w-[246px] flex-row items-center rounded-full bg-secondary p-1 border border-border">
                {/* Sliding Background */}
                <Animated.View
                    style={[{ width: '33.33%', height: '100%' }, animatedStyle]}
                    className="absolute left-1 top-1 rounded-full bg-primary shadow-sm"
                />

                {INTERVAL_ITEMS.map((item: { label: string; value: SubscriptionInterval }) => (
                    <Pressable
                        key={item.value}
                        onPress={() => onIntervalChange(item.value)}
                        className="z-10 flex-1 items-center justify-center"
                    >
                        <Text className={cn(
                            'text-[13px] font-bold transition-colors',
                            activeInterval === item.value ? 'text-primary-foreground' : 'text-muted-foreground'
                        )}>
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};
