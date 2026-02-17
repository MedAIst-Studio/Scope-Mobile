import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Crown, Lock } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';

interface SubscriptionBlurOverlayProps {
    isVisible: boolean;
    children: React.ReactNode;
}

export const SubscriptionBlurOverlay = ({
    isVisible,
    children,
}: SubscriptionBlurOverlayProps) => {
    const router = useRouter();

    if (!isVisible) return <>{children}</>;

    return (
        <View className="flex-1">
            <View className="flex-1">
                {children}
            </View>

            <BlurView intensity={20} tint="light" className="absolute inset-0 justify-center items-center">
                <View className="w-[85%] p-8 bg-background/90 rounded-[2rem] items-center shadow-2xl">
                    <View className="w-20 h-20 justify-center items-center mb-5">
                        <View className="w-16 h-16 rounded-full bg-foreground justify-center items-center">
                            <Icon as={Lock} size={32} color="white" />
                        </View>
                        <View className="absolute top-0 right-0 bg-background p-2 rounded-full shadow-sm">
                            <Icon as={Crown} size={16} className="text-primary fill-primary" />
                        </View>
                    </View>

                    <Text className="text-xl font-bold text-foreground text-center mb-3">Bu Özellik Premium Paketine Özeldir</Text>
                    <Text className="text-sm text-muted-foreground text-center mb-7 leading-5">
                        Tüm quizlere erişmek ve yapay zeka desteğiyle öğrenmeye devam etmek için paketini hemen yükselt.
                    </Text>

                    <Button
                        className="w-full rounded-2xl h-14"
                        onPress={() => router.push('/packages' as any)}
                    >
                        <Text className="text-primary-foreground font-bold">Şimdi Üye Ol</Text>
                    </Button>
                </View>
            </BlurView>
        </View>
    );
};
