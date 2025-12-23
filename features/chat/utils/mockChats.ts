export interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export const mockChats: ChatSession[] = [
  {
    id: '1',
    title: 'Kalp Krizi Belirtileri',
    date: 'Bugün',
    preview: 'Göğüs ağrısı ve...',
  },
  {
    id: '2',
    title: 'Diyabet Tedavisi',
    date: 'Dün',
    preview: 'İnsülin kullanımı...',
  },
  {
    id: '3',
    title: 'Grip ve Soğuk Algınlığı',
    date: 'Geçen Hafta',
    preview: 'C vitamini takviyesi...',
  },
  {
    id: '4',
    title: 'Radyoloji Raporu Analizi',
    date: '2 Hafta Önce',
    preview: 'Akciğer grafisi...',
  },
];
