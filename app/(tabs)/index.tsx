import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CameraIcon,
  ChatBubbleOvalLeftIcon,
  DocumentTextIcon,
  SparklesIcon,
} from 'react-native-heroicons/solid';
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} className="px-6 pb-20">
          {/* Header */}
          <View className="mb-10 mt-8 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50">
                {getGreeting()}
              </Text>
              <Text className="text-3xl font-bold capitalize tracking-tighter text-foreground">
                {user?.username || 'Ömer Faruk'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(app)/profile')}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-sm">
              <Text className="text-xl font-bold text-primary">
                {user?.username?.charAt(0).toUpperCase() || 'Ö'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Featured Action */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/scan')}
            className="mb-8 overflow-hidden rounded-[2.5rem] bg-primary p-8 shadow-xl shadow-primary/30">
            <View className="mb-8 flex-row items-center justify-between">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Icon as={CameraIcon} size={32} color="white" />
              </View>
              <Badge variant="default" className="h-8 border-0 bg-white/20 px-4">
                <SparklesIcon size={14} color="white" className="" />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
                  YENİ ÖZELLİK
                </Text>
              </Badge>
            </View>
            <View>
              <Text className="text-3xl font-bold tracking-tight text-white">Soru Tarat</Text>
              <Text className="text-lg font-medium text-white/80">Yapay zeka ile anında çözüm</Text>
            </View>
            <View className="absolute bottom-8 right-8 h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <ArrowRightIcon size={24} color="white" />
            </View>
          </TouchableOpacity>

          {/* Quick Actions Grid */}
          <Text className="mb-6 ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
            Hızlı Erişim
          </Text>

          <View className="gap-6">
            <View className="flex-row gap-6">
              {/* Secondary: Chat */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/chat')}
                className="h-44 flex-1 rounded-[2rem] border border-border/40 bg-card p-6 shadow-md shadow-black/5">
                <View className="flex-1 justify-between">
                  <View className="self-start rounded-2xl bg-primary/10 p-3">
                    <Icon as={ChatBubbleOvalLeftIcon} size={28} className="text-primary" />
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-foreground">Asistan</Text>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                      Yapay Zeka Sohbet
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Secondary: Files */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/(tabs)/files')}
                className="h-44 flex-1 rounded-[2rem] border border-border/40 bg-card p-6 shadow-md shadow-black/5">
                <View className="flex-1 justify-between">
                  <View className="self-start rounded-2xl bg-secondary/80 p-3">
                    <Icon as={DocumentTextIcon} size={28} className="text-foreground/60" />
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-foreground">Dosyalar</Text>
                    <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                      Döküman Arşivi
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Quiz Action */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/quiz')}
              className="h-28 w-full flex-row items-center gap-5 rounded-[2rem] border border-border/40 bg-card px-7 shadow-md shadow-black/5">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50">
                <Icon as={AcademicCapIcon} size={28} className="text-foreground/40" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground">Sınavlarım</Text>
                <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
                  Kişisel Başarı Takibi
                </Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <ArrowRightIcon size={20} className="text-muted-foreground/40" />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
