import { useRouter } from 'expo-router';
import { useQuizzes } from './useQueries';

export const useQuiz = () => {
  const router = useRouter();
  const { data: quizzes, isLoading, error, refetch } = useQuizzes();

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    router.push('/quiz/create');
  };

  return {
    quizzes,
    isLoading,
    error,
    refetch,
    handleStartQuiz,
    handleCreateQuiz,
  };
};
