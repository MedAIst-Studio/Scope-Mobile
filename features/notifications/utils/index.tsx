import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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

        const token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Emülatörde push notification çalışmaz, gerçek cihaz lazım.');
    }
}
