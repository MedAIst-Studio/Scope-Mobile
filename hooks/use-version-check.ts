import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import * as Application from 'expo-application';
import { Alert, Linking, Platform } from 'react-native';

interface SystemConfig {
    min_version: string;
    latest_version: string;
    force_update: boolean;
    store_url_android: string;
    store_url_ios: string;
    message: string;
}

const isVersionObsolete = (current: string, min: string) => {
    const currentParts = current.split('.').map(Number);
    const minParts = min.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
        const c = currentParts[i] || 0;
        const m = minParts[i] || 0;
        if (c < m) return true;
        if (c > m) return false;
    }
    return false;
};

export const useVersionCheck = () => {
    const { data: config, isLoading } = useQuery<SystemConfig>({
        queryKey: ['system-config'],
        queryFn: async () => {
            const response = await apiClient.get('/system/config');
            return response.data;
        },
        staleTime: 1000 * 60 * 20, // 20 minutes cache
        gcTime: 1000 * 60 * 60, // 1 hour garbage collection
    });

    const currentVersion = Application.nativeApplicationVersion || "1.0.0";
    const isObsolete = config ? isVersionObsolete(currentVersion, config.min_version) : false;
    const isLockinVisible = !!config && (isObsolete || config.force_update);

    const handleUpdatePress = () => {
        const url = Platform.OS === 'ios' ? config?.store_url_ios : config?.store_url_android;
        if (url) {
            Linking.openURL(url).catch(() => {
                Alert.alert("Hata", "Mağaza açılamadı. Lütfen uygulamayı marketten manuel güncelleyin.");
            });
        }
    };

    return { isLockinVisible, config, handleUpdatePress, isLoading };
};