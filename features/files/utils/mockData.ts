import { PDFFile } from '../types';

export const mockPDFFiles: PDFFile[] = [
  {
    id: '1',
    name: 'Kardiyoloji Ders Notları',
    fileName: 'kardiyoloji.pdf',
    size: '2.4 MB',
    uploadDate: '01.10.2024',
    messageCount: 15,
    status: 'ready',
  },
  {
    id: '2',
    name: 'Anatomi Kitabı - Bölüm 3',
    fileName: 'anatomi-bolum3.pdf',
    size: '5.1 MB',
    uploadDate: '28.09.2024',
    messageCount: 0,
    status: 'processing',
    isProcessing: true,
    processingProgress: 65,
  },
];

export const getFileStatusBadge = (file: PDFFile) => {
  if (file.isProcessing) {
    return {
      text: 'İşleniyor',
      variant: 'secondary' as const,
      color: 'orange',
    };
  }

  if (file.status === 'ready') {
    return {
      text: 'Hazır',
      variant: 'default' as const,
      color: 'green',
    };
  }

  if (file.status === 'error') {
    return {
      text: 'Hata',
      variant: 'destructive' as const,
      color: 'red',
    };
  }

  return {
    text: 'Bekliyor',
    variant: 'outline' as const,
    color: 'gray',
  };
};
