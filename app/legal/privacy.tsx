import {
  LegalBullet,
  LegalLayout,
  LegalSection,
  LegalText,
} from '@/features/legal/components/LegalLayout';
import { useLegalStore } from '@/features/legal/stores/useLegalStore';
import { Lock } from 'lucide-react-native';
import { View } from 'react-native';

export default function PrivacyScreen() {
  const markPrivacyRead = useLegalStore((state) => state.markPrivacyRead);

  return (
    <LegalLayout
      title="Gizlilik Politikası"
      subtitle="Verileriniz nasıl işleniyor?"
      icon={Lock}
      onReadComplete={markPrivacyRead}>
      <LegalText>
        YKS Asistanın ("Platform") olarak, gizliliğinize ve kişisel verilerinizin korunmasına büyük
        önem veriyoruz. Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu
        ("KVKK") ve ilgili mevzuat uyarınca, Platformu kullanırken topladığımız verileri, bu
        verilerin nasıl işlendiğini, saklandığını ve haklarınızı detaylı bir şekilde açıklamaktadır.
      </LegalText>

      <LegalSection title="1. Toplanan Veriler ve Toplama Yöntemleri">
        <LegalText>
          Platformu kullanımınız sırasında, doğrudan sizin sağladığınız veya otomatik olarak
          toplanan çeşitli verileri işliyoruz:
        </LegalText>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Kimlik Bilgileri:</LegalText> Ad, soyad,
          kullanıcı adı ve doğum tarihi gibi temel kimlik bilgileri.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">İletişim Bilgileri:</LegalText> E-posta
          adresi, telefon numarası (opsiyonel) ve iletişim tercihleri.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Kullanıcı İçeriği:</LegalText>{' '}
          Yüklediğiniz soru fotoğrafları, PDF ders notları, chat bot ile yaptığınız yazışmalar ve
          sesli komutlar. Bu veriler, eğitim deneyiminizi kişiselleştirmek için analiz edilir.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Teknik ve Cihaz Verileri:</LegalText> IP
          adresi, cihaz marka/modeli, işletim sistemi sürümü, uygulama sürümü, çerez bilgileri ve
          hata raporları.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Kullanım İstatistikleri:</LegalText>{' '}
          Hangi konulara ne kadar çalıştığınız, uygulama içi gezinme süreniz ve etkileşimleriniz.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="2. Verilerin İşlenme Amaçları">
        <LegalText>Topladığımız verileri şu yasal ve operasyonel amaçlarla kullanıyoruz:</LegalText>
        <LegalBullet>
          Size özel çalışma programları ve soru çözüm önerileri geliştirmek.
        </LegalBullet>
        <LegalBullet>
          Yapay zeka modellerimizi (ChatGPT, Vision API vb.) kullanarak sorularınızı analiz etmek ve
          yanıtlamak.
        </LegalBullet>
        <LegalBullet>
          Platform güvenliğini sağlamak, hileli kullanımları tespit etmek ve önlemek.
        </LegalBullet>
        <LegalBullet>
          Yasal yükümlülüklerimizi yerine getirmek (örneğin, yetkili makamların taleplerine yanıt
          vermek).
        </LegalBullet>
        <LegalBullet>Uygulama performansını izleyerek teknik sorunları gidermek.</LegalBullet>
      </LegalSection>

      <LegalSection title="3. Verilerin Paylaşımı ve Yapay Zeka">
        <LegalText>
          Kişisel verileriniz, izniniz olmaksızın üçüncü şahıslara satılmaz veya kiralanmaz. Ancak,
          hizmetin doğası gereği bazı veriler iş ortaklarıyla paylaşılabilir:
        </LegalText>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">
            Yapay Zeka Servis Sağlayıcıları:
          </LegalText>{' '}
          Sorularınız ve metinleriniz, analiz edilmek üzere OpenAI gibi altyapı sağlayıcılarına
          anonimleştirilerek iletilebilir. Bu veriler, bu sağlayıcıların kendi modellerini eğitmesi
          için <LegalText className="font-bold">kullanılmaz</LegalText>.
        </LegalBullet>
        <LegalBullet>
          <LegalText className="font-bold text-foreground">Bulut Depolama Hizmetleri:</LegalText>{' '}
          Verileriniz, güvenli sunucularda (AWS, Google Cloud vb.) şifreli olarak saklanır.
        </LegalBullet>
      </LegalSection>

      <LegalSection title="4. Veri Saklama ve Güvenlik">
        <LegalText>
          Verileriniz, üyeliğiniz devam ettiği sürece ve yasal saklama süreleri boyunca muhafaza
          edilir. SSL/TLS şifreleme, güvenlik duvarları ve erişim kontrolleri gibi endüstri
          standardı güvenlik önlemleri uyguluyoruz. Ancak, internet üzerinden veri iletiminin %100
          güvenli olduğunun garantisi verilemez.
        </LegalText>
      </LegalSection>

      <LegalSection title="5. Haklarınız">
        <LegalText>KVKK kapsamında aşağıdaki haklara sahipsiniz:</LegalText>
        <LegalBullet>Kişisel verilerinizin işlenip işlenmediğini öğrenme.</LegalBullet>
        <LegalBullet>İşlenen verilerinizin düzeltilmesini veya silinmesini talep etme.</LegalBullet>
        <LegalBullet>Verilerinizin aktarıldığı üçüncü kişileri öğrenme.</LegalBullet>
        <LegalBullet>Aleyhinize çıkan bir sonuca itiraz etme.</LegalBullet>
        <LegalText className="mt-2">
          Bu haklarınızı kullanmak için{' '}
          <LegalText className="font-bold text-primary">yasal@yksasistanin.com</LegalText> üzerinden
          bizimle iletişime geçebilirsiniz.
        </LegalText>
      </LegalSection>

      <LegalSection title="6. Değişiklikler">
        <LegalText>
          Bu politika zaman zaman güncellenebilir. Önemli değişiklikler uygulama üzerinden bildirim
          yoluyla duyurulacaktır.
        </LegalText>
        <LegalText className="mt-4 font-bold text-foreground/60">
          Metnin sonuna geldiniz. Onaylamak için aşağıdaki butonu kullanabilirsiniz.
        </LegalText>
      </LegalSection>

      <View className="h-20" />
    </LegalLayout>
  );
}
