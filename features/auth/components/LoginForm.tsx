import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { FormAlert } from '@/components/shared/FormAlert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useLoginForm, useSocialAuth } from '../hooks/useAuthForms';
import { LoginLayout } from './AuthLayout';

type LoginFormData = Parameters<ReturnType<typeof useLoginForm>['onSubmit']>[0];

function LoginFormContent({
  form,
  isLoading,
  error,
  onSubmit,
}: {
  form: ReturnType<typeof useLoginForm>['form'];
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: LoginFormData) => void;
}) {
  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-5">
        <FormAlert message={error} />
        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="E-posta"
          name="email"
          placeholder="E-posta adresiniz"
          type={FormFieldType.EMAIL}
          required
        />

        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="Şifre"
          name="password"
          placeholder="Şifreniz"
          type={FormFieldType.PASSWORD}
          required
        />

        <View className="items-end">
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-sm font-bold text-primary">Şifremi Unuttum</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        className="h-14 w-full flex-row items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30"
        size="lg">
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold tracking-tight text-primary-foreground">
            Giriş Yap
          </Text>
        )}
      </Button>

      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-sm font-medium text-muted-foreground/50">Henüz hesabın yok mu?</Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-sm font-bold text-primary">Kayıt Ol</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

export function LoginForm() {
  const { form, isLoading, error, onSubmit, setIsLoading } = useLoginForm();
  const { handleGoogleLogin, handleFacebookLogin } = useSocialAuth(setIsLoading);

  return (
    <LoginLayout
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      isLoading={isLoading}>
      <LoginFormContent form={form} isLoading={isLoading} error={error} onSubmit={onSubmit} />
    </LoginLayout>
  );
}
