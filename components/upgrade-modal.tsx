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
        label: 'Mesaj',
        icon: MessageSquare,
        description: 'Günlük mesaj limitinize ulaştınız. Daha fazla mesaj göndermek için planınızı yükseltin.',
    },
    ocr: {
        label: 'Soru Tarama',
        icon: Camera,
        description: 'Günlük soru tarama limitinize ulaştınız. Daha fazla soru taramak için planınızı yükseltin.',
    },
    pdf_chat: {
        label: 'PDF Sohbet',
        icon: FileText,
        description: 'PDF sohbet limitinize ulaştınız. Daha fazla PDF analizi için planınızı yükseltin.',
    },
    file_upload: {
        label: 'Dosya Yükleme',
        icon: Upload,
        description: 'Dosya yükleme limitinize ulaştınız. Daha fazla dosya yüklemek için planınızı yükseltin.',
    },
    quiz: {
        label: 'Quiz',
        icon: GraduationCap,
        description: 'Günlük quiz limitinize ulaştınız. Daha fazla quiz çözmek için planınızı yükseltin.',
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
        router.push('/(app)/subscription/paywall');
    };

    return (
        <AlertDialog open={!!feature} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="max-w-[90%] md:max-w-[400px]">
                <AlertDialogHeader className="items-center pb-2">
                    <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Icon as={config.icon} size={40} className="text-primary" />
                    </View>
                    <AlertDialogTitle className="text-center text-xl font-bold">
                        {config.label} Limitine Ulaştınız
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
