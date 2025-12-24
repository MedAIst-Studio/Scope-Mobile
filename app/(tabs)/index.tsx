import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'Tünaydın';
    return 'İyi Akşamlar';
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        <SafeAreaView edges={['top']} className="px-6 pb-8">
          {/* Header */}
          <View className="mb-8 mt-6 flex-row items-center justify-between">
            <View>
              <Text className="text-lg text-muted-foreground">{getGreeting()},</Text>
              <Text className="text-3xl font-bold capitalize text-foreground">
                {user?.username || 'Ömer Faruk'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/(settings)/profile')}>
              <View className="h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/20">
                <Text className="text-lg font-bold text-primary">
                  {user?.username?.charAt(0).toUpperCase() || 'Ö'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Actions Grid */}
          <Text className="mb-4 text-xl font-bold text-foreground">Hızlı Erişim</Text>

          <View className="gap-4">
            {/* Main Action: Camera Scan */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/scan')}
              className="h-48 w-full overflow-hidden rounded-3xl shadow-lg shadow-primary/20">
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1 justify-between p-6">
                <View className="self-start rounded-2xl bg-white/20 p-3 backdrop-blur-md">
                  <Icon as={CameraIcon} size={32} color="white" />
                </View>
                <View>
                  <Text className="mb-1 text-2xl font-bold text-white">Soru Tarat</Text>
                  <Text className="text-base text-white/80">Yapay zeka ile anında çözüm</Text>
                </View>
                <View className="absolute bottom-4 right-4 rounded-full bg-white/20 p-2">
                  <Icon as={ArrowRightIcon} size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-row gap-4">
              {/* Secondary: Chat */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/chat')}
                className="h-40 flex-1 overflow-hidden rounded-3xl border-2 border-b-4 border-border bg-card">
                <View className="flex-1 justify-between p-5">
                  <View className="self-start rounded-xl bg-orange-500/10 p-3">
                    <Icon as={ChatBubbleLeftRightIcon} size={24} className="text-orange-500" />
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-foreground">Sohbet</Text>
                    <Text className="text-xs text-muted-foreground">Asistanınla konuş</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Secondary: Files */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/files')}
                className="h-40 flex-1 overflow-hidden rounded-3xl border-2 border-b-4 border-border bg-card">
                <View className="flex-1 justify-between p-5">
                  <View className="self-start rounded-xl bg-blue-500/10 p-3">
                    <Icon as={DocumentTextIcon} size={24} className="text-blue-500" />
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-foreground">Dosyalar</Text>
                    <Text className="text-xs text-muted-foreground">Dokümanların</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/quiz')}
              className="h-24 w-full flex-row items-center gap-4 overflow-hidden rounded-3xl border-2 border-b-4 border-border bg-card px-6">
              <View className="rounded-xl bg-green-500/10 p-3">
                <Icon as={AcademicCapIcon} size={24} className="text-green-500" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">Sınavlarım</Text>
                <Text className="text-xs text-muted-foreground">Kendini test et</Text>
              </View>
              <Icon as={ArrowRightIcon} size={20} className="text-muted-foreground" />
            </TouchableOpacity>
          </View>

          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-foreground">Son Aktiviteler</Text>
            {/* Placeholder for Recent Activity */}
            <View className="items-center justify-center rounded-2xl border-2 border-b-4 border-border bg-card p-4 py-8">
              <Text className="text-muted-foreground">Henüz aktivite yok</Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
