import { useState } from 'react';
import { Quiz, QuizFilters } from '../types';
import { mockQuizzes } from '../utils/mockData';

export const useQuiz = () => {
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [filters, setFilters] = useState<QuizFilters>({
    category: 'Tümü',
    difficulty: 'Tümü',
    status: 'Tümü',
  });

  const filteredQuizzes = quizzes.filter((quiz) => {
    const categoryMatch = filters.category === 'Tümü' || quiz.category === filters.category;
    const difficultyMatch = filters.difficulty === 'Tümü' || quiz.difficulty === filters.difficulty;
    const statusMatch =
      filters.status === 'Tümü' ||
      (filters.status === 'Tamamlanan' && quiz.status === 'completed') ||
      (filters.status === 'Tamamlanmayan' && quiz.status !== 'completed');

    return categoryMatch && difficultyMatch && statusMatch;
  });

  const updateFilter = <K extends keyof QuizFilters>(key: K, value: QuizFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartQuiz = (quizId: string) => {
    console.log('Starting quiz:', quizId);
    // TODO: Navigate to quiz or implement quiz logic
  };

  const handleCreateQuiz = () => {
    console.log('Creating new quiz');
    // TODO: Navigate to quiz creation
  };

  return {
    quizzes: filteredQuizzes,
    filters,
    updateFilter,
    handleStartQuiz,
    handleCreateQuiz,
  };
};
