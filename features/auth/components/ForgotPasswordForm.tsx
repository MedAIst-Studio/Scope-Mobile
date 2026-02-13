import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    console.log('Forgot password data:', data);
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  if (emailSent) {
    return (
      <View className="flex flex-col gap-8 py-4">
        <View className="flex flex-col items-center gap-6">
          <View className="h-20 w-20 items-center justify-center rounded-[2rem] bg-green-500/10 shadow-sm shadow-green-500/10">
            <Check size={40} color="#10b981" />
          </View>

          <View className="gap-2">
            <Text className="text-center text-2xl font-bold tracking-tight text-foreground">
              E-posta Gönderildi
            </Text>
            <Text className="px-4 text-center text-base font-medium leading-6 text-muted-foreground/60">
              Şifre sıfırlama bağlantısını{' '}
              <Text className="font-bold text-foreground">{form.getValues('email')}</Text> adresine
              gönderdik.
            </Text>
          </View>
        </View>

        <View className="flex flex-col gap-4">
          <Button
            onPress={() => {
              setEmailSent(false);
              form.reset();
            }}
            variant="secondary"
            className="h-14 w-full rounded-2xl">
            <Text className="text-base font-bold tracking-tight text-foreground">Tekrar Dene</Text>
          </Button>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Button className="h-14 w-full rounded-2xl bg-primary shadow-xl shadow-primary/30">
                <Text className="text-base font-bold tracking-tight text-primary-foreground">
                  Giriş Sayfasına Dön
                </Text>
              </Button>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-8">
      <View className="flex flex-col gap-4">
        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="E-posta"
          name="email"
          placeholder="E-posta adresiniz"
          type={FormFieldType.EMAIL}
          required
          description="Sıfırlama bağlantısı bu adrese gönderilecek."
        />
      </View>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        className="h-14 w-full flex-row items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30"
        size="lg">
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold tracking-tight text-primary-foreground">
            Bağlantı Gönder
          </Text>
        )}
      </Button>

      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-sm font-medium text-muted-foreground/50">Şifreni hatırladın mı?</Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-sm font-bold text-primary">Giriş Yap</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
