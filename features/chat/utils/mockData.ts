import { Message, QuickQuestion } from '../types';

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Merhaba! Ben MedAIst, tıbbi AI asistanınızım. Size nasıl yardımcı olabilirim? 👋',
    isUser: false,
    timestamp: '14:30',
  },
  {
    id: '2',
    text: 'Kalp krizi belirtileri nelerdir?',
    isUser: true,
    timestamp: '14:32',
  },
  {
    id: '3',
    text: "Kalp krizi (miyokard infarktüsü) belirtileri şunlardır:\n\n🫀 **Ana Belirtiler:**\n• Göğüs ağrısı veya baskı hissi\n• Sol kola yayılan ağrı\n• Nefes darlığı\n• Bulantı, kusma\n• Aşırı terleme\n• Baş dönmesi\n\n⚠️ **Acil Durum:** Bu belirtiler yaşanıyorsa derhal 112'yi arayın!\n\nBaşka sorularınız var mı?",
    isUser: false,
    timestamp: '14:33',
  },
  {
    id: '4',
    text: 'Teşekkürler! Kan basıncı hakkında da bilgi alabilir miyim?',
    isUser: true,
    timestamp: '14:35',
  },
  {
    id: '5',
    text: 'Tabii ki! Kan basıncı ile ilgili önemli bilgiler:\n\n📊 **Normal Değerler:**\n• Sistolik: 90-120 mmHg\n• Diastolik: 60-80 mmHg\n\n🔴 **Yüksek Tansiyon (Hipertansiyon):**\n• 140/90 mmHg ve üzeri\n• Sessiz katil olarak bilinir\n• Kalp, beyin, böbrek hasarına neden olabilir\n\n💡 **Doğal Düşürme Yöntemleri:**\n• Düzenli egzersiz\n• Az tuzlu beslenme\n• Stres yönetimi\n• Kilo kontrolü\n\nDüzenli ölçüm yaptırıyor musunuz?',
    isUser: false,
    timestamp: '14:36',
  },
];

export const quickQuestions: QuickQuestion[] = [
  { id: '1', text: 'İnsan kalbi nasıl çalışır?' },
  { id: '2', text: 'Akciğerlerin temel işlevleri nelerdir?' },
  { id: '3', text: 'Beyin ve sinir sistemi nasıl iletişim kurar?' },
  { id: '4', text: 'Vücuttaki ana organ sistemleri nelerdir?' },
];

export const getAIResponse = (userMessage: string): string => {
  const responses = [
    'Bu konuda size yardımcı olabilirim! Detaylı bilgi için lütfen belirtilerinizi açıklayın. 🩺',
    'Harika bir soru! Bu durumda şu faktörleri göz önünde bulundurmalıyız:\n\n• Risk faktörleri\n• Semptomlar\n• Önleme yöntemleri\n\nDaha spesifik bilgi ister misiniz?',
    'Bu konuda dikkat edilmesi gereken önemli noktalar var. Size özel bir değerlendirme yapabilmem için:\n\n📋 Yaş ve cinsiyet\n📋 Mevcut sağlık durumu\n📋 İlaç kullanımı\n\nBu bilgileri paylaşabilir misiniz?',
    'Çok önemli bir konu! Uzman görüşü alınması gereken durumlar:\n\n⚠️ Acil belirtiler varsa\n⚠️ Semptomlar devam ediyorsa\n⚠️ Risk faktörleri mevcutsa\n\nSağlık durumunuz hakkında endişe var mı?',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};
