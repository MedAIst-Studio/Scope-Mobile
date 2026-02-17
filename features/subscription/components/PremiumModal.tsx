import { useRouter } from 'expo-router';
import { CheckCircle2, Crown, X } from 'lucide-react-native';
import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';

interface PremiumModalProps {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const PremiumModal = ({
    isVisible,
    onClose,
    title = "Premium'a Yükselt",
    description = "Bu özelliği sınırsız kullanmak ve tüm içeriklere erişmek için paketini yükselt.",
}: PremiumModalProps) => {
    const router = useRouter();

    const handleUpgrade = () => {
        onClose();
        router.push('/packages' as any);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity
                    className="absolute inset-0 bg-black/60"
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View className="w-[85%] bg-background rounded-3xl p-6 items-center shadow-2xl">
                    <TouchableOpacity className="absolute top-4 right-4" onPress={onClose}>
                        <Icon as={X} size={24} className="text-muted-foreground" />
                    </TouchableOpacity>

                    <View className="w-20 h-20 rounded-full bg-primary/10 justify-center items-center mb-5">
                        <Icon as={Crown} size={48} className="text-primary fill-primary" />
                    </View>

                    <Text className="text-2xl font-bold text-foreground text-center mb-3">{title}</Text>
                    <Text className="text-base text-muted-foreground text-center mb-6 leading-6">{description}</Text>

                    <View className="w-full mb-6">
                        <View className="flex-row items-center mb-3 px-4">
                            <Icon as={CheckCircle2} size={18} className="text-emerald-500" />
                            <Text className="text-sm font-medium text-muted-foreground ml-3">Sınırsız Mesajlaşma</Text>
                        </View>
                        <View className="flex-row items-center mb-3 px-4">
                            <Icon as={CheckCircle2} size={18} className="text-emerald-500" />
                            <Text className="text-sm font-medium text-muted-foreground ml-3">Tüm Quizlere Erişim</Text>
                        </View>
                        <View className="flex-row items-center mb-3 px-4">
                            <Icon as={CheckCircle2} size={18} className="text-emerald-500" />
                            <Text className="text-sm font-medium text-muted-foreground ml-3">Sınırsız PDF Taraması</Text>
                        </View>
                    </View>

                    <Button
                        className="w-full rounded-2xl h-14"
                        onPress={handleUpgrade}
                    >
                        <Text className="text-primary-foreground font-bold">Paketleri İncele</Text>
                    </Button>
                </View>
            </View>
        </Modal>
    );
};
