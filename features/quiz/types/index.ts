export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  questions: number;
  duration: number;
  completed: boolean;
  score: number | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
  difficulty?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: number;
  userId: string;
  answers: number[];
  score: number;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface Document {
  id: number;
  name: string;
  pages: number;
  uploaded: string;
  fileType?: string;
  size?: number;
}

export interface QuizState {
  isActive: boolean;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showResult: boolean;
  answers: (number | null)[];
  score: number;
  startTime: string | null;
}

export interface QuizFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  questionCount: number;
  documentId: number;
}

export interface QuizFilters {
  category: string;
  difficulty: string;
  completed: boolean | null;
}

export interface QuizListItem {
  id: string;
  title: string;
  createdAt: string;
  totalQuestions: number;
}
