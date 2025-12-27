import { useRouter } from 'expo-router';
import { QuizRequestData } from '../validation';
import { useCreateQuiz, useQuizzes, useSubmissions } from './useQueries';

export const useQuiz = () => {
  const router = useRouter();
  const {
    data: quizzes,
    isLoading: isQuizzesLoading,
    error: quizzesError,
    refetch: refetchQuizzes,
  } = useQuizzes();
  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    refetch: refetchSubmissions,
  } = useSubmissions();
  const { mutateAsync: createQuiz } = useCreateQuiz();

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    router.push('/quiz/create');
  };

  const handleCreateQuizSubmit = async (data: QuizRequestData) => {
    await createQuiz(data);
    // Navigation back is handled by the form component via onSuccess callback
    // or we can invalidate queries here
  };

  return {
    quizzes,
    submissions: submissionsData?.attempts || [],
    isLoading: isQuizzesLoading || isSubmissionsLoading,
    error: quizzesError,
    refetch: () => Promise.all([refetchQuizzes(), refetchSubmissions()]),
    handleStartQuiz,
    handleCreateQuiz,
    handleCreateQuizSubmit,
  };
};
