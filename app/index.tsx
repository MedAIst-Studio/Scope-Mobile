import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { AcademicCapIcon, ArrowRightIcon, MoonIcon, SunIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <Stack.Screen options={SCREEN_OPTIONS} />
        <View className="flex-1 bg-background px-6 pt-24">
          {/* Brand Area */}
          <View className="mb-16 items-center">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary shadow-xl shadow-primary/30">
              <AcademicCapIcon size={48} color="white" />
            </View>
            <Text className="text-center text-4xl font-bold tracking-tighter text-foreground">
              MedAIst
            </Text>
            <Text className="mt-2 text-center font-medium text-muted-foreground">
              Tıbbi Bilginin Akıllı Asistanı
            </Text>
          </View>

          {/* Info Area */}
          <View className="mb-12 gap-6">
            <View className="rounded-[2rem] border border-border/20 bg-card/50 p-6">
              <Text className="mb-1 text-lg font-bold text-foreground">Hızlı Teşhis & Bilgi</Text>
              <Text className="text-sm leading-5 text-muted-foreground">
                Yapay zeka destekli analizler ile tıbbi dökümanlarınızı saniyeler içinde anlayın.
              </Text>
            </View>

            <View className="rounded-[2rem] border border-border/20 bg-card/50 p-6">
              <Text className="mb-1 text-lg font-bold text-foreground">Eğitim & Testler</Text>
              <Text className="text-sm leading-5 text-muted-foreground">
                Öğrendiklerinizi pekiştirmek için kişiselleştirilmiş quizler ile kendinizi test
                edin.
              </Text>
            </View>
          </View>

          {/* Action Area */}
          <View className="gap-4">
            <Link href="/(tabs)" asChild>
              <Button size="lg" className="h-16 rounded-2xl shadow-lg shadow-primary/20">
                <Text className="mr-2 text-lg font-bold text-primary-foreground">
                  Hemen Başlayın
                </Text>
                <ArrowRightIcon size={20} color="white" />
              </Button>
            </Link>

            <Link href="/login" asChild>
              <Button variant="outline" size="lg" className="h-16 rounded-2xl border-border/40">
                <Text className="text-lg font-bold text-foreground">Giriş Yap</Text>
              </Button>
            </Link>
          </View>

          {/* Footer */}
          <View className="absolute bottom-12 left-0 right-0 items-center">
            <ThemeToggle />
            <Text className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
              © 2025 MedAIst Studio
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPress={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="h-12 w-12 rounded-2xl bg-secondary/50">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} size={24} className="text-foreground" />
    </Button>
  );
}
