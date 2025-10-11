import { Button } from '@/components/ui/button';
import { StatusBar } from 'expo-status-bar';
import { Camera, FolderOpen, Plus, Scan, Upload } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FilesScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100">
      <KeyboardAvoidingView className="flex-1">
        <StatusBar style="auto" />

        {/* Header */}
        <View className="px-6 pb-2 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Dosyalarım 📁</Text>
              <Text className="text-gray-600">Belgelerinizi yönetin</Text>
            </View>
            <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
              <Plus size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Upload Options */}
          <View className="mb-6 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <Text className="mb-4 text-xl font-bold text-gray-800">📤 Yeni Dosya Ekle</Text>

            <View className="mb-4 flex-row gap-3">
              <Button className="h-16 flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <View className="items-center gap-1">
                  <Camera size={24} color="white" />
                  <Text className="text-sm font-medium text-white">Fotoğraf</Text>
                  <Text className="text-sm font-medium text-white">Çek</Text>
                </View>
              </Button>

              <Button className="h-16 flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                <View className="items-center gap-1">
                  <Scan size={24} color="white" />
                  <Text className="text-sm font-medium text-white">Doküman</Text>
                  <Text className="text-sm font-medium text-white">Tara</Text>
                </View>
              </Button>

              <Button className="h-16 flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                <View className="items-center gap-1">
                  <Upload size={24} color="white" />
                  <Text className="text-sm font-medium text-white">Dosya</Text>
                  <Text className="text-sm font-medium text-white">Yükle</Text>
                </View>
              </Button>
            </View>
          </View>

          {/* File Categories */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-bold text-gray-800">📂 Kategoriler</Text>
            <View className="gap-3">
              <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <Text className="text-xl">🩻</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">Tıbbi Raporlar</Text>
                    <Text className="text-sm text-gray-600">12 dosya</Text>
                  </View>
                </View>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-xl">🧪</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">Laboratuvar Sonuçları</Text>
                    <Text className="text-sm text-gray-600">8 dosya</Text>
                  </View>
                </View>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-white/80 p-4 shadow-md">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <Text className="text-xl">💊</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">Reçeteler</Text>
                    <Text className="text-sm text-gray-600">5 dosya</Text>
                  </View>
                </View>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Files */}
          <View className="mb-20">
            <Text className="mb-4 text-lg font-bold text-gray-800">📋 Son Dosyalar</Text>
            <View className="items-center rounded-xl bg-white/60 p-6">
              <FolderOpen size={48} color="#9CA3AF" />
              <Text className="mt-3 text-center text-gray-500">
                Henüz dosyanız yok.{'\n'}Yukarıdaki seçeneklerden birini kullanarak dosya ekleyin!
                📁
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FilesScreen;
