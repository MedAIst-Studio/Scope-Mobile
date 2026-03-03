import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { FormAlert } from '@/components/shared/FormAlert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
    useCreatePracticeQuiz,
    useSubjects,
    useSubjectTopics,
} from '@/features/quiz/hooks/useQueries';
import { GeneratePracticeQuizRequestData, generatePracticeQuizRequestSchema } from '@/features/quiz/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Settings2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeQuizScreen() {
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<GeneratePracticeQuizRequestData>({
        resolver: zodResolver(generatePracticeQuizRequestSchema),
        defaultValues: {
            questionCount: 5,
        },
    });

    const watchExamType = form.watch('examType');
    const watchSubject = form.watch('subject');

    const { data: subjects, isLoading: isSubjectsLoading } = useSubjects(watchExamType || null);
    const { data: topics, isLoading: isTopicsLoading } = useSubjectTopics(watchSubject || null);

    const { mutateAsync: createPracticeQuiz } = useCreatePracticeQuiz();

    // Reset dependent fields when parent fields change
    useEffect(() => {
        form.setValue('subject', '');
        form.setValue('topic', '');
    }, [watchExamType, form]);

    useEffect(() => {
        form.setValue('topic', '');
    }, [watchSubject, form]);

    const onSubmit = async (data: GeneratePracticeQuizRequestData) => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            const result = await createPracticeQuiz(data);

            if (result?.id) {
                router.replace(`/(app)/quiz/${result.id}`);
            } else {
                setGlobalError('Quiz oluşturuldu ancak ID alınamadı.');
            }
        } catch (err: any) {
            setGlobalError(err.message || 'Quiz oluşturulurken bir hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                <View className="gap-6 pb-8">
                    <View className="mb-4 flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-bold text-foreground">Mini Sınav</Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                                Kendi sınavını kendin oluştur
                            </Text>
                        </View>
                        <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Icon as={Settings2} size={24} className="text-primary" />
                        </View>
                    </View>

                    <FormAlert message={globalError} />

                    {/* Exam Type Selection */}
                    <DynamicFormField
                        control={form.control}
                        name="examType"
                        label="Sınav Tipi"
                        placeholder="Sınav Tipini Seçin"
                        type={FormFieldType.SELECT}
                        options={[
                            { label: 'TYT', value: 'TYT' },
                            { label: 'AYT', value: 'AYT' },
                        ]}
                    />

                    {/* Subject Selection */}
                    <DynamicFormField
                        control={form.control}
                        name="subject"
                        label="Ders"
                        placeholder={isSubjectsLoading ? 'Dersler yükleniyor...' : (watchExamType ? 'Ders Seçin' : 'Önce Sınav Tipi Seçin')}
                        type={FormFieldType.SELECT}
                        disabled={!watchExamType}
                        isLoading={isSubjectsLoading}
                        options={subjects?.map((sub: any) => ({ label: sub.name, value: sub.id }))}
                    />

                    {/* Topic Selection */}
                    <DynamicFormField
                        control={form.control}
                        name="topic"
                        label="Konu"
                        placeholder={isTopicsLoading ? 'Konular yükleniyor...' : (watchSubject ? 'Konu Seçin' : 'Önce Ders Seçin')}
                        type={FormFieldType.SELECT}
                        disabled={!watchSubject}
                        isLoading={isTopicsLoading}
                        options={topics?.map((topic: any) => ({ label: topic.name, value: topic.id }))}
                    />

                    {/* Question Count Selection */}
                    <DynamicFormField
                        control={form.control}
                        name="questionCount"
                        label="Soru Sayısı"
                        placeholder="Soru Sayısı Seçin"
                        type={FormFieldType.SELECT}
                        options={[
                            { label: '5 Soru', value: '5' },
                            { label: '10 Soru', value: '10' },
                            { label: '15 Soru', value: '15' },
                            { label: '20 Soru', value: '20' },
                        ]}
                    />
                </View>
            </ScrollView>

            {/* Submit Action */}
            <View className="border-t border-border p-4 bg-background">
                <Button
                    onPress={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !form.formState.isValid}
                    size="lg"
                    className="w-full h-14 rounded-2xl">
                    <Text className="text-lg font-semibold">
                        {isSubmitting ? 'Test Hazırlanıyor...' : 'Teste Başla'}
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}
