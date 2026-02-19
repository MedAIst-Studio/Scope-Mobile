import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useStreak } from '../hooks';

interface StreakIndicatorProps {
    className?: string;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({ className }) => {
    const router = useRouter();
    const animation = useRef<LottieView>(null);
    const { data: streak, isLoading } = useStreak();

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);
    const translateY = useSharedValue(-20);

    useEffect(() => {
        opacity.value = withSpring(1);
        scale.value = withSpring(1);
        translateY.value = withSpring(0);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { translateY: translateY.value }
        ],
    }));

    if (isLoading) {
        return null;
    }

    const hasStreak = (streak?.current_streak ?? 0) > 0;

    return (
        <Animated.View style={animatedStyle}>
            <Button
                variant="ghost"
                onPress={() => router.push('/(app)/streak')}
                className={cn(
                    "flex-row items-center px-3 py-1.5 rounded-full border h-10 min-w-0",
                    hasStreak
                        ? 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20'
                        : 'bg-secondary border-secondary/50',
                    className
                )}
            >
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 24,
                        height: 24,
                        opacity: hasStreak ? 1 : 0.4,
                    }}
                    colorFilters={!hasStreak ? [
                        { keypath: "**", color: "#94a3b8" }
                    ] : []}
                    source={require('@/assets/animations/fire.json')}
                />
                <Text className={cn(
                    "font-bold ml-1 text-sm",
                    hasStreak ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'
                )}>
                    {hasStreak ? `${streak?.current_streak} Gün` : 'Başla'}
                </Text>
            </Button>
        </Animated.View>
    );
};
