import { Quiz } from '../types';

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'İç Hastalıkları Tanı Yöntemleri',
    description: 'Klinik değerlendirme ve diagnostik yaklaşımlar',
    category: 'İç Hastalıkları',
    difficulty: 'Orta',
    questionCount: 25,
    duration: 35,
    status: 'not-started',
  },
  {
    id: '2',
    title: 'Göz Hastalıkları Acil Durumlar',
    description: 'Oftalmoloji acil tanı ve müdahale',
    category: 'Oftalmoloji',
    difficulty: 'İleri',
    questionCount: 15,
    duration: 25,
    status: 'completed',
    completionRate: 87,
    lastScore: 13,
  },
];

export const categories = ['Tümü', 'Kardiyoloji', 'İç Hastalıkları', 'Oftalmoloji', 'Nöroloji'];
export const difficulties = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];
export const statuses = ['Tümü', 'Tamamlanan', 'Tamamlanmayan'];

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Başlangıç':
      return 'bg-green-100 text-green-700';
    case 'Orta':
      return 'bg-yellow-100 text-yellow-700';
    case 'İleri':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'in-progress':
      return 'bg-blue-100 text-blue-700';
    case 'not-started':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Tamamlandı';
    case 'in-progress':
      return 'Devam Ediyor';
    case 'not-started':
      return 'Başlanmadı';
    default:
      return 'Bilinmiyor';
  }
};
