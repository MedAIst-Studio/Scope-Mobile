import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { FormAlert } from '@/components/shared/FormAlert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';
import { useQuiz } from '../hooks/useQuiz';
import { quizRequestSchema } from '../validation';
import { FileSelector } from './FileSelector';

const createQuizSchema = quizRequestSchema.refine(
  (data) => {
    if (data.startPage && data.endPage) {
      return data.startPage <= data.endPage;
    }
    return true;
  },
  {
    message: 'Başlangıç sayfası bitiş sayfasından büyük olamaz',
    path: ['startPage'],
  }
);

type CreateQuizFormData = z.infer<typeof createQuizSchema>;

interface CreateQuizFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateQuizForm: React.FC<CreateQuizFormProps> = ({ onSuccess, onCancel }) => {
  const { handleCreateQuizSubmit } = useQuiz();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      quizName: '',
      fileId: '',
    },
  });

  const onSubmit = async (data: CreateQuizFormData) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      await handleCreateQuizSubmit(data);
      onSuccess();
    } catch (error: any) {
      setGlobalError(error.message || 'Quiz oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-8">
          <FormAlert message={globalError} />

          <DynamicFormField
            control={form.control}
            name="quizName"
            label="Quiz Adı"
            placeholder="Quiz için bir isim girin"
            type={FormFieldType.INPUT}
            required
          />

          <FileSelector
            selectedFileId={form.watch('fileId')}
            onSelect={(fileId) => form.setValue('fileId', fileId, { shouldValidate: true })}
            error={form.formState.errors.fileId?.message}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <DynamicFormField
                control={form.control}
                name="startPage"
                label="Başlangıç Sayfası"
                placeholder="1"
                type={FormFieldType.NUMBER}
              />
            </View>
            <View className="flex-1">
              <DynamicFormField
                control={form.control}
                name="endPage"
                label="Bitiş Sayfası"
                placeholder="10"
                type={FormFieldType.NUMBER}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-border pt-4">
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          size="lg"
          className="w-full">
          <Text>{isSubmitting ? 'Oluşturuluyor...' : 'Quiz Oluştur'}</Text>
        </Button>
      </View>
    </View>
  );
};
