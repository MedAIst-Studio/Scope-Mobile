import {
  LegalBullet,
  LegalLayout,
  LegalSection,
  LegalText,
} from '@/features/legal/components/LegalLayout';
import { useLegalStore } from '@/features/legal/stores/useLegalStore';
import { View } from 'react-native';
import { DocumentTextIcon } from 'react-native-heroicons/solid';

export default function TermsScreen() {
  const markTermsRead = useLegalStore((state) => state.markTermsRead);

  return (
    <LegalLayout
      title="Kullanım Koşulları"
      subtitle="Hizmet kullanım şartları"
      icon={DocumentTextIcon}
      onReadComplete={markTermsRead}>
      <LegalText>
        YKS Asistanın ("Uygulama") hizmetlerine erişiminiz ve kullanımınız, işbu Kullanım Koşulları
        ("Koşullar") hükümlerine tabidir. Uygulamayı indirerek veya kullanarak, bu koşulları okumuş,
        anlamış ve kabul etmiş sayılırsınız.
      </LegalText>

      <LegalSection title="1. Hizmetin Kapsamı ve Niteliği">
        <LegalText>
          YKS Asistanın, lise öğrencilerine üniversiteye hazırlık sürecinde (TYT/AYT/YDT) yapay zeka
          destekli yardımcı kaynaklar sunan bir eğitim teknolojisi aracıdır.
        </LegalText>
        <LegalBullet>
          Uygulama; soru çözümü, konu özetleri, çalışma planlaması ve rehberlik botu gibi özellikler
          içerir.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">
            Sınav Başarısı Garantisi Yoktur:
          </LegalText>{' '}
          Uygulama, çalışmanızı destekleyici bir araçtır. Sınavlarda elde edeceğiniz başarı tamamen
          kendi çalışma disiplininize bağlıdır; uygulama size belirli bir puan veya sıralama garanti
          etmez.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="2. Yapay Zeka ve İçerik Doğruluğu">
        <LegalText>
          Uygulama içerisindeki birçok özellik (soru analizi, sohbet botu vb.) üretken yapay zeka
          teknolojileri kullanır.
        </LegalText>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Hata Payı:</LegalText> Yapay zeka, zaman
          zaman yanlış, eksik veya yanıltıcı bilgiler üretebilir ("halüsinasyon"). Özellikle
          karmaşık matematik/fen sorularında veya güncel müfredat değişikliklerinde hata payı
          olabilir.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Teyit Sorumluluğu:</LegalText> Kritik
          bilgileri ve şüpheli durumlarda, lütfen ders kitaplarınız, öğretmenleriniz veya resmi ÖSYM
          kaynaklarından teyit alınız.
        </LegalBullet>
        <LegalBullet>
          Uygulama, sağlanan bilgilerin doğruluğundan veya bu bilgilerin kullanımından doğacak
          zararlardan sorumlu tutulamaz.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="3. Kullanıcı Yükümlülükleri">
        <LegalText>Uygulamayı kullanırken aşağıdaki kurallara uymayı taahhüt edersiniz:</LegalText>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Hesap Güvenliği:</LegalText> Şifrenizin
          güvenliğinden siz sorumlusunuz. Hesabınızla yapılan tüm işlemlerden siz sorumlu
          tutulursunuz.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Uygunsuz İçerik:</LegalText> Soru yükleme
          özelliğini kullanarak yasa dışı, müstehcen, telif hakkı ihlali içeren veya saldırgan
          görseller/metinler yükleyemezsiniz.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Teknik Müdahale:</LegalText> Uygulamanın
          kaynak kodlarına erişmeye çalışmak, tersine mühendislik yapmak veya sunuculara saldırmak
          yasaktır.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="4. Üyelik, Ücretlendirme ve İptal">
        <LegalText>
          Uygulamanın bazı özellikleri ücretsiz ("Freemium"), bazıları ise ücretli abonelik
          gerektirebilir.
        </LegalText>
        <LegalBullet>
          Ücretli abonelikler, seçilen döneme (aylık/yıllık) göre otomatik yenilenebilir.
        </LegalBullet>
        <LegalBullet>
          Aboneliğinizi platform mağazası (App Store/Google Play) ayarlarından istediğiniz zaman
          iptal edebilirsiniz. İptal işlemi, mevcut dönemin sonunda geçerli olur; kısmi iade
          yapılmaz.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="5. Fikri Mülkiyet">
        <LegalText>
          Uygulamanın tasarımı, logosu, yazılımı ve özel içerikleri YKS Asistanın mülkiyetindedir.
          İzinsiz kopyalanamaz veya çoğaltılamaz.
        </LegalText>
      </LegalSection>

      <LegalSection title="6. Değişiklik ve Fesih">
        <LegalText>
          YKS Asistanın, herhangi bir zamanda hizmeti durdurma, özelliklerini değiştirme veya bu
          koşulları güncelleme hakkını saklı tutar. Kuralların ihlali durumunda hesabınız bildirim
          yapılmaksızın askıya alınabilir veya silinebilir.
        </LegalText>
        <LegalText className="mt-4 font-bold text-foreground/60">
          Metnin sonuna geldiniz. Onaylamak için aşağıdaki butonu kullanabilirsiniz.
        </LegalText>
      </LegalSection>

      <View className="h-20" />
    </LegalLayout>
  );
}
