import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Crown } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';

export const UpgradeButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/packages' as any)}
            activeOpacity={0.9}
            className="w-[90%] rounded-[20px] overflow-hidden shadow-lg shadow-primary/30 my-5"
        >
            <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
            >
                <View className="flex-row items-center">
                    <View className="w-11 h-11 rounded-full bg-white/20 justify-center items-center mr-4">
                        <Icon as={Crown} size={20} className="text-yellow-400 fill-yellow-400" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">Paketi Yükselt</Text>
                        <Text className="text-white/80 text-xs mt-0.5">Tüm özellikleri sınırsız kullan</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};
