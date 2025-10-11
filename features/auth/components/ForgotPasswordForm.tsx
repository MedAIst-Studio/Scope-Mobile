import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
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
      <View className="flex flex-col gap-6 text-center">
        <View className="flex flex-col items-center gap-4">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Text className="text-2xl text-green-600">✓</Text>
          </View>

          <Text className="text-xl font-semibold text-foreground">E-posta Gönderildi</Text>

          <Text className="text-center text-muted-foreground">
            Şifre sıfırlama bağlantısını {form.getValues('email')} adresine gönderdik. E-posta
            kutunuzu kontrol edin.
          </Text>
        </View>

        <View className="flex flex-col gap-4">
          <Button
            onPress={() => {
              setEmailSent(false);
              form.reset();
            }}
            variant="outline"
            className="w-full">
            Tekrar Dene
          </Button>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Button className="w-full">Giriş Sayfasına Dön</Button>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-4">
        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="E-posta"
          name="email"
          placeholder="E-posta adresiniz"
          type={FormFieldType.EMAIL}
          required
          description="Bu e-posta adresine şifre sıfırlama bağlantısı göndereceğiz"
        />
      </View>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        className="w-full"
        size="lg">
        <Text>{isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}</Text>
      </Button>

      {/* Geri Dön Linki */}
      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm text-muted-foreground">Şifrenizi hatırladınız mı?</Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-sm font-medium text-primary">Giriş Yap</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
