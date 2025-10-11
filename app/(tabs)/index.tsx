import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { Edit, MoreHorizontal, RotateCcw, Send } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
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
  ]);

  const quickQuestions = [
    { id: '1', text: 'İnsan kalbi nasıl çalışır?' },
    { id: '2', text: 'Akciğerlerin temel işlevleri nelerdir?' },
    { id: '3', text: 'Beyin ve sinir sistemi nasıl iletişim kurar?' },
    { id: '4', text: 'Vücuttaki ana organ sistemleri nelerdir?' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Kullanıcı mesajını ekle
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage('');

      // Auto scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Mock AI yanıtı (2 saniye sonra)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(message.trim()),
          isUser: false,
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);

        // Auto scroll after AI response
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000);
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      'Bu konuda size yardımcı olabilirim! Detaylı bilgi için lütfen belirtilerinizi açıklayın. 🩺',
      'Harika bir soru! Bu durumda şu faktörleri göz önünde bulundurmalıyız:\n\n• Risk faktörleri\n• Semptomlar\n• Önleme yöntemleri\n\nDaha spesifik bilgi ister misiniz?',
      'Bu konuda dikkat edilmesi gereken önemli noktalar var. Size özel bir değerlendirme yapabilmem için:\n\n📋 Yaş ve cinsiyet\n📋 Mevcut sağlık durumu\n📋 İlaç kullanımı\n\nBu bilgileri paylaşabilir misiniz?',
      'Çok önemli bir konu! Uzman görüşü alınması gereken durumlar:\n\n⚠️ Acil belirtiler varsa\n⚠️ Semptomlar devam ediyorsa\n⚠️ Risk faktörleri mevcutsa\n\nSağlık durumunuz hakkında endişe var mı?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-6 ${item.isUser ? 'items-end' : 'items-start'}`}>
      <View className="max-w-[80%]">
        {item.isUser ? (
          <View className="rounded-2xl rounded-br-sm border-2 border-b-4 border-primary-darker bg-primary px-4 py-3">
            <Text className="text-sm leading-5 text-primary-foreground">{item.text}</Text>
          </View>
        ) : (
          <Text className="leading-5 text-foreground">{item.text}</Text>
        )}
      </View>
    </View>
  );

  const renderQuickQuestion = ({ item }: { item: { id: string; text: string } }) => (
    <Button variant={'outline'} onPress={() => setMessage(item.text)} className="mb-2">
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">🧠</Text>
        <Text className="flex-1 text-sm">{item.text}</Text>
      </View>
    </Button>
  );

  return (
    <SafeAreaView className="flex-1 bg-background pt-12" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="absolute left-0 right-0 top-0 z-10 h-20 flex-row items-center justify-between border-b border-border bg-background px-4 pt-6">
        <View className="flex-row items-center gap-3">
          <Button size={'icon'} variant={'outline'}>
            <Icon as={RotateCcw} size={20} />
          </Button>
          <Button size={'icon'} variant={'outline'}>
            <Icon as={Edit} size={20} />
          </Button>
        </View>

        <Button size={'icon'} variant={'outline'}>
          <Icon as={MoreHorizontal} size={20} />
        </Button>
      </View>

      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {messages.map((m) => (
            <React.Fragment key={m.id}>{renderMessage({ item: m })}</React.Fragment>
          ))}

          {messages.length === 0 ? (
            <View className="items-center py-12">
              <Text className="mb-4 text-center text-lg font-semibold text-foreground">
                MedAIst ile Sohbet Edin 🤖
              </Text>
              <Text className="mb-6 text-center text-sm text-muted-foreground">
                Tıbbi sorularınızı sorun ve hızlı cevaplar alın
              </Text>
              <View className="w-full gap-2">
                {quickQuestions.map((question) => renderQuickQuestion({ item: question }))}
              </View>
            </View>
          ) : (
            <View className="mt-4 gap-2">
              <Text className="mb-2 text-center text-sm text-muted-foreground">Hızlı sorular:</Text>
              {quickQuestions.map((question) => renderQuickQuestion({ item: question }))}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="mx-2 pb-2">
          <View className="flex-row items-end gap-3">
            <Textarea
              value={message}
              onChangeText={setMessage}
              placeholder="Sorunuzu yazın..."
              className="flex-1 bg-white text-sm dark:bg-background"
              style={{
                maxHeight: 120,
                minHeight: 48,
              }}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            />

            <Button
              variant={'outline'}
              onPress={handleSendMessage}
              aria-disabled={!message.trim()}
              className={`h-12 w-12 items-center justify-center rounded-full`}
              disabled={!message.trim()}>
              <Icon as={Send} size={18} />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
