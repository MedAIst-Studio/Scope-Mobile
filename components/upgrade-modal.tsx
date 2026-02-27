import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { UpgradeFeature } from '@/lib/error-handling/ErrorEventBus';
import { useRouter } from 'expo-router';
import { Camera, FileText, GraduationCap, MessageSquare, Upload } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

const FEATURE_CONFIG: Record<UpgradeFeature, { label: string; icon: any; description: string }> = {
    message: {
        label: 'Sohbet Bitti mi?',
        icon: MessageSquare,
        description: 'Bugünkü beyin fırtınası limitin doldu! Yapay zekayla daha fazla konuşup netlerini uçurmak ister misin?',
    },
    ocr: {
        label: 'Soru Canavarı',
        icon: Camera,
        description: 'Limit bitti ama çözülecek çok soru var! Sınırsız tarama ile hız kesmeden çalışmaya devam et.',
    },
    pdf_chat: {
        label: 'PDF Analizi',
        icon: FileText,
        description: 'Bu döküman çok dertliymiş, limit yetmedi! Saniyeler içinde tüm dosyayı analiz etmek için Pro\'ya geç.',
    },
    file_upload: {
        label: 'Kütüphane',
        icon: Upload,
        description: 'Çantan doldu! Daha fazla kaynak yükleyip her şeyi tek noktada toplamak için yerini ayırt.',
    },
    quiz: {
        label: 'Sınav Maratonu',
        icon: GraduationCap,
        description: 'Harika gidiyordun! Limit bitti ama hedeflerin bitmedi. Sınırsız quiz ile dereceye oyna.',
    },
};

interface UpgradeModalProps {
    feature: UpgradeFeature | null;
    onClose: () => void;
}

export function UpgradeModal({ feature, onClose }: UpgradeModalProps) {
    const router = useRouter();

    if (!feature) return null;

    const config = FEATURE_CONFIG[feature];
    if (!config) return null;

    const handleUpgrade = () => {
        onClose();
        setTimeout(() => {
            router.push('/(app)/subscription/paywall');
        }, 300);
    };

    return (
        <AlertDialog open={!!feature} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="max-w-[90%] md:max-w-[400px]">
                <AlertDialogHeader className="items-center pb-2">
                    <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Icon as={config.icon} size={40} className="text-primary" />
                    </View>
                    <AlertDialogTitle className="text-center text-xl font-bold">
                        {config.label} Limitine Ulaştın
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-base leading-relaxed">
                        {config.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-3">
                    <AlertDialogCancel onPress={onClose}>
                        <Text className="text-center text-base font-semibold">Kapat</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={handleUpgrade}>
                        <Text className="text-center text-base font-bold">Planları Gör</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
