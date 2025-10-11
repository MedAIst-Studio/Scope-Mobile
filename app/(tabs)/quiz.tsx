import { Button } from '@/components/ui/button';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Brain, Clock, Star, Target, Trophy, Zap } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const QuizScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-50 to-pink-100">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Quiz Merkezi 🧠</Text>
            <Text className="text-gray-600">Bilginizi test edin</Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
            <Trophy size={24} color="#8B5CF6" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Stats Card */}
        <View className="mb-6 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
          <Text className="mb-4 text-xl font-bold text-gray-800">📊 İstatistikleriniz</Text>

          <View className="flex-row gap-3">
            <View className="flex-1 items-center rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
              <Star size={24} color="#F59E0B" />
              <Text className="mt-2 text-2xl font-bold text-gray-800">0</Text>
              <Text className="text-sm text-gray-600">Puan</Text>
            </View>

            <View className="flex-1 items-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 p-4">
              <Target size={24} color="#10B981" />
              <Text className="mt-2 text-2xl font-bold text-gray-800">0%</Text>
              <Text className="text-sm text-gray-600">Doğruluk</Text>
            </View>

            <View className="flex-1 items-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
              <Clock size={24} color="#3B82F6" />
              <Text className="mt-2 text-2xl font-bold text-gray-800">0</Text>
              <Text className="text-sm text-gray-600">Quiz</Text>
            </View>
          </View>
        </View>

        {/* Quick Quiz */}
        <View className="mb-6 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
              <Zap size={20} color="white" />
            </View>
            <Text className="text-xl font-bold text-gray-800">⚡ Hızlı Quiz</Text>
          </View>

          <Text className="mb-6 leading-relaxed text-gray-600">
            5 dakikada çözebileceğiniz kısa bir quiz ile bilginizi test edin!
          </Text>

          <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
            <View className="flex-row items-center gap-2">
              <Brain size={20} color="white" />
              <Text className="font-semibold text-white">Hızlı Quiz Başlat</Text>
            </View>
          </Button>
        </View>

        {/* Quiz Categories */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-bold text-gray-800">📚 Kategoriler</Text>
          <View className="gap-3">
            <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <Text className="text-xl">❤️</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">Kardiyoloji</Text>
                  <Text className="text-sm text-gray-600">25 soru • Orta</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-xl">🧠</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">Nöroloji</Text>
                  <Text className="text-sm text-gray-600">30 soru • Zor</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Text className="text-xl">🦴</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">Ortopedi</Text>
                  <Text className="text-sm text-gray-600">20 soru • Kolay</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Text className="text-xl">💊</Text>
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">Farmakoloji</Text>
                  <Text className="text-sm text-gray-600">35 soru • Çok Zor</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-20">
          <Text className="mb-4 text-lg font-bold text-gray-800">🎯 Son Aktiviteler</Text>
          <View className="items-center rounded-xl bg-white/60 p-6">
            <BookOpen size={48} color="#9CA3AF" />
            <Text className="mt-3 text-center text-gray-500">
              Henüz quiz çözmediniz.{'\n'}İlk quiz'inizi başlatmak için yukarıdaki kategorilerden
              birini seçin! 🚀
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizScreen;
