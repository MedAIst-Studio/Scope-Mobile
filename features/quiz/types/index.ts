export type QuizCategory = 'Tümü' | 'Kardiyoloji' | 'İç Hastalıkları' | 'Oftalmoloji' | 'Nöroloji';

export type QuizDifficulty = 'Tümü' | 'Başlangıç' | 'Orta' | 'İleri';

export type QuizStatus = 'Tümü' | 'Tamamlanan' | 'Tamamlanmayan';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  questionCount: number;
  duration: number; // minutes
  status: 'completed' | 'in-progress' | 'not-started';
  completionRate?: number;
  lastScore?: number;
}

export interface QuizFilters {
  category: QuizCategory;
  difficulty: QuizDifficulty;
  status: QuizStatus;
}
