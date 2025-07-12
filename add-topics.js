const topics = [
  // LGS Matematik Konuları
  { lesson_id: 'lgs-mat', name: 'Sayılar ve İşlemler', description: 'Doğal sayılar, tam sayılar, rasyonel sayılar' },
  { lesson_id: 'lgs-mat', name: 'Cebirsel İfadeler', description: 'Denklemler, eşitsizlikler, fonksiyonlar' },
  { lesson_id: 'lgs-mat', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çokgenler' },
  { lesson_id: 'lgs-mat', name: 'Ölçme', description: 'Alan, çevre, hacim hesaplamaları' },
  { lesson_id: 'lgs-mat', name: 'Veri İşleme', description: 'Grafikler, istatistik, olasılık' },

  // LGS Türkçe Konuları
  { lesson_id: 'lgs-turkce', name: 'Okuma', description: 'Anlama, yorumlama, çıkarım yapma' },
  { lesson_id: 'lgs-turkce', name: 'Yazma', description: 'Kompozisyon, paragraf, anlatım teknikleri' },
  { lesson_id: 'lgs-turkce', name: 'Dil Bilgisi', description: 'Fiiller, isimler, sıfatlar, zamirler' },
  { lesson_id: 'lgs-turkce', name: 'Noktalama', description: 'Noktalama işaretleri, yazım kuralları' },

  // LGS Fen Bilimleri Konuları
  { lesson_id: 'lgs-fen', name: 'Fizik', description: 'Kuvvet, hareket, enerji, elektrik' },
  { lesson_id: 'lgs-fen', name: 'Kimya', description: 'Madde, atom, elementler, bileşikler' },
  { lesson_id: 'lgs-fen', name: 'Biyoloji', description: 'Hücre, sistemler, ekoloji, genetik' },

  // LGS Sosyal Bilgiler Konuları
  { lesson_id: 'lgs-sosyal', name: 'Tarih', description: 'İnkılap tarihi, Osmanlı tarihi' },
  { lesson_id: 'lgs-sosyal', name: 'Coğrafya', description: 'Türkiye coğrafyası, iklim, nüfus' },
  { lesson_id: 'lgs-sosyal', name: 'Vatandaşlık', description: 'Demokrasi, haklar, sorumluluklar' },

  // LGS İngilizce Konuları
  { lesson_id: 'lgs-ing', name: 'Grammar', description: 'Temel dilbilgisi kuralları' },
  { lesson_id: 'lgs-ing', name: 'Vocabulary', description: 'Kelime bilgisi ve kullanımı' },
  { lesson_id: 'lgs-ing', name: 'Reading', description: 'Okuma anlama ve yorumlama' },

  // TYT Matematik Konuları
  { lesson_id: 'tyt-mat', name: 'Temel Matematik', description: 'Sayılar, rasyonel sayılar, mutlak değer' },
  { lesson_id: 'tyt-mat', name: 'Problemler', description: 'Sayı problemleri, yaş problemleri, hız problemleri' },
  { lesson_id: 'tyt-mat', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çember' },
  { lesson_id: 'tyt-mat', name: 'Cebir', description: 'Denklemler, eşitsizlikler, fonksiyonlar' },

  // TYT Türkçe Konuları
  { lesson_id: 'tyt-turkce', name: 'Paragraf', description: 'Ana düşünce, yardımcı düşünce, anlatım teknikleri' },
  { lesson_id: 'tyt-turkce', name: 'Dil Bilgisi', description: 'Fiilimsiler, cümle türleri, cümle öğeleri' },
  { lesson_id: 'tyt-turkce', name: 'Anlatım Bozuklukları', description: 'Dil yanlışları, anlatım hataları' },

  // TYT Fen Bilimleri Konuları
  { lesson_id: 'tyt-fen', name: 'Fizik', description: 'Mekanik, elektrik, optik, termodinamik' },
  { lesson_id: 'tyt-fen', name: 'Kimya', description: 'Madde, atom, periyodik sistem, kimyasal bağlar' },
  { lesson_id: 'tyt-fen', name: 'Biyoloji', description: 'Hücre, sistemler, ekoloji, genetik' },

  // TYT Sosyal Bilimler Konuları
  { lesson_id: 'tyt-sosyal', name: 'Tarih', description: 'İnkılap tarihi, Osmanlı tarihi, genel tarih' },
  { lesson_id: 'tyt-sosyal', name: 'Coğrafya', description: 'Türkiye ve dünya coğrafyası' },
  { lesson_id: 'tyt-sosyal', name: 'Felsefe', description: 'Felsefe tarihi, mantık, ahlak' },

  // AYT Matematik Konuları
  { lesson_id: 'ayt-mat', name: 'Türev', description: 'Türev alma, türev uygulamaları' },
  { lesson_id: 'ayt-mat', name: 'İntegral', description: 'İntegral alma, integral uygulamaları' },
  { lesson_id: 'ayt-mat', name: 'Limit', description: 'Limit kavramı ve uygulamaları' },
  { lesson_id: 'ayt-mat', name: 'Trigonometri', description: 'Trigonometrik fonksiyonlar ve uygulamaları' },

  // AYT Fizik Konuları
  { lesson_id: 'ayt-fizik', name: 'Mekanik', description: 'Kuvvet, hareket, enerji, momentum' },
  { lesson_id: 'ayt-fizik', name: 'Elektrik', description: 'Elektrik alan, elektrik potansiyel, akım' },
  { lesson_id: 'ayt-fizik', name: 'Optik', description: 'Işık, yansıma, kırılma, mercekler' },
  { lesson_id: 'ayt-fizik', name: 'Modern Fizik', description: 'Atom fiziği, nükleer fizik' },

  // AYT Kimya Konuları
  { lesson_id: 'ayt-kimya', name: 'Kimyasal Tepkimeler', description: 'Tepkime hızları, denge' },
  { lesson_id: 'ayt-kimya', name: 'Çözeltiler', description: 'Çözünürlük, derişim, asit-baz' },
  { lesson_id: 'ayt-kimya', name: 'Organik Kimya', description: 'Hidrokarbonlar, fonksiyonel gruplar' },

  // AYT Biyoloji Konuları
  { lesson_id: 'ayt-biyoloji', name: 'Hücre', description: 'Hücre yapısı, hücre bölünmesi' },
  { lesson_id: 'ayt-biyoloji', name: 'Sistemler', description: 'Sindirim, dolaşım, solunum sistemleri' },
  { lesson_id: 'ayt-biyoloji', name: 'Genetik', description: 'Kalıtım, genetik mühendisliği' },
  { lesson_id: 'ayt-biyoloji', name: 'Ekoloji', description: 'Popülasyon, komünite, ekosistem' },

  // AYT Edebiyat Konuları
  { lesson_id: 'ayt-edebiyat', name: 'Divan Edebiyatı', description: 'Klasik Türk edebiyatı' },
  { lesson_id: 'ayt-edebiyat', name: 'Halk Edebiyatı', description: 'Anonim halk edebiyatı, âşık edebiyatı' },
  { lesson_id: 'ayt-edebiyat', name: 'Tanzimat Edebiyatı', description: 'Tanzimat dönemi edebiyatı' },
  { lesson_id: 'ayt-edebiyat', name: 'Cumhuriyet Edebiyatı', description: 'Cumhuriyet dönemi edebiyatı' },

  // AYT Tarih Konuları
  { lesson_id: 'ayt-tarih', name: 'Osmanlı Tarihi', description: 'Osmanlı Devleti kuruluş, yükselme, gerileme' },
  { lesson_id: 'ayt-tarih', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı ve Cumhuriyet dönemi' },
  { lesson_id: 'ayt-tarih', name: 'Çağdaş Türk Tarihi', description: '20. yüzyıl Türk tarihi' },

  // AYT Coğrafya Konuları
  { lesson_id: 'ayt-cografya', name: 'Fiziki Coğrafya', description: 'İklim, yer şekilleri, toprak' },
  { lesson_id: 'ayt-cografya', name: 'Beşeri Coğrafya', description: 'Nüfus, yerleşme, ekonomik faaliyetler' },
  { lesson_id: 'ayt-cografya', name: 'Türkiye Coğrafyası', description: 'Türkiye\'nin fiziki ve beşeri özellikleri' },

  // AYT Felsefe Konuları
  { lesson_id: 'ayt-felsefe', name: 'Felsefe Tarihi', description: 'Antik çağdan günümüze felsefe' },
  { lesson_id: 'ayt-felsefe', name: 'Mantık', description: 'Mantık kuralları ve akıl yürütme' },
  { lesson_id: 'ayt-felsefe', name: 'Ahlak Felsefesi', description: 'Ahlak teorileri ve değerler' },

  // KPSS Genel Yetenek Konuları
  { lesson_id: 'kpss-gy', name: 'Türkçe', description: 'Dil bilgisi, anlatım, paragraf' },
  { lesson_id: 'kpss-gy', name: 'Matematik', description: 'Temel matematik, problemler' },
  { lesson_id: 'kpss-gy', name: 'Geometri', description: 'Temel geometri konuları' },

  // KPSS Genel Kültür Konuları
  { lesson_id: 'kpss-gk', name: 'Tarih', description: 'Osmanlı tarihi, inkılap tarihi' },
  { lesson_id: 'kpss-gk', name: 'Coğrafya', description: 'Türkiye coğrafyası' },
  { lesson_id: 'kpss-gk', name: 'Vatandaşlık', description: 'Anayasa, idare hukuku' },
  { lesson_id: 'kpss-gk', name: 'Güncel Bilgiler', description: 'Güncel olaylar ve gelişmeler' },

  // KPSS Eğitim Bilimleri Konuları
  { lesson_id: 'kpss-egitim', name: 'Gelişim Psikolojisi', description: 'Çocuk ve ergen gelişimi' },
  { lesson_id: 'kpss-egitim', name: 'Öğrenme Psikolojisi', description: 'Öğrenme teorileri ve süreçleri' },
  { lesson_id: 'kpss-egitim', name: 'Ölçme ve Değerlendirme', description: 'Test geliştirme ve değerlendirme' },
  { lesson_id: 'kpss-egitim', name: 'Program Geliştirme', description: 'Eğitim programı tasarımı' },

  // KPSS ÖABT Konuları
  { lesson_id: 'kpss-oabt', name: 'Alan Bilgisi', description: 'Branşa özel alan bilgisi' },
  { lesson_id: 'kpss-oabt', name: 'Alan Eğitimi', description: 'Branşa özel öğretim yöntemleri' }
];

async function addTopics() {
  console.log('Konular ekleniyor...');
  
  for (const topic of topics) {
    try {
      const response = await fetch('http://localhost:3000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topic),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${topic.name} eklendi (ID: ${data.id})`);
      } else {
        const error = await response.json();
        console.log(`❌ ${topic.name} eklenemedi: ${error.error}`);
      }
    } catch (error) {
      console.log(`❌ ${topic.name} eklenirken hata: ${error.message}`);
    }
  }
  
  console.log('Konular ekleme işlemi tamamlandı!');
}

// Scripti çalıştır
addTopics(); 