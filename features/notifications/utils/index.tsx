import { apiClient } from '@/lib/api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const CACHE_KEY_FCM_TOKEN = 'last_registered_fcm_token';

export async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Hatırlatıcılar, duyurular ve yeni özelliklerden haberdar olmak için bildirimleri açmalısınız.');
            return;
        }

        const token = (await Notifications.getDevicePushTokenAsync()).data;

        const lastToken = await SecureStore.getItemAsync(CACHE_KEY_FCM_TOKEN);
        if (lastToken === token) {
            return;
        }

        const { error } = await apiClient.patch("/users/fcm-token", { fcm_token: token });

        if (error) {
            console.error("FCM token registration failed:", error);
        } else {
            await SecureStore.setItemAsync(CACHE_KEY_FCM_TOKEN, token);
        }
    } else {
        alert('Emülatörde push notification çalışmaz, gerçek cihaz lazım.');
    }
}

