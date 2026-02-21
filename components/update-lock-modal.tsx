import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useVersionCheck } from '@/hooks/use-version-check';
import * as Application from 'expo-application';
import { ArrowUpCircle } from 'lucide-react-native';
import React from 'react';
import { BackHandler, View } from 'react-native';

export function UpdateLockModal() {
    const { isLockinVisible, config, handleUpdatePress } = useVersionCheck();
    const currentVersion = Application.nativeApplicationVersion || "1.0.0";

    React.useEffect(() => {
        if (isLockinVisible) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
            return () => backHandler.remove();
        }
    }, [isLockinVisible]);

    if (!isLockinVisible) return null;

    return (
        <AlertDialog open={isLockinVisible}>
            <AlertDialogContent className="max-w-[90%] md:max-w-[400px]">
                <AlertDialogHeader className="items-center pb-2">
                    <View className="bg-primary/10 mb-4 h-20 w-20 items-center justify-center rounded-full">
                        <Icon as={ArrowUpCircle} size={48} className="text-primary" />
                    </View>
                    <AlertDialogTitle className="text-center text-2xl font-bold">
                        Güncelleme Gerekli
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-base leading-relaxed">
                        {config?.message || 'Uygulamanız çok eski. Devam etmek için lütfen en son sürümü güncelleyin.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <View className="bg-secondary/30 my-2 flex-row justify-around rounded-xl p-4">
                    <View className="items-center">
                        <Text className="text-muted-foreground text-xs uppercase tracking-wider">Mevcut</Text>
                        <Text className="font-mono text-lg font-bold">v{currentVersion}</Text>
                    </View>
                    <View className="bg-border h-full w-[1px]" />
                    <View className="items-center">
                        <Text className="text-muted-foreground text-xs uppercase tracking-wider">Güncel</Text>
                        <Text className="text-primary font-mono text-lg font-bold">v{config?.latest_version || 'v2.0.0'}</Text>
                    </View>
                </View>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogAction
                        onPress={handleUpdatePress}
                    >
                        <Text className="text-center text-base font-bold">Şimdi Güncelle</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
