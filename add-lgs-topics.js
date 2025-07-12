const lgsTopics = [
  // LGS Matematik Konuları (2025 Güncel)
  { lesson_id: 'lgs-mat', name: 'Doğal Sayılar', description: 'Doğal sayılarla işlemler, çarpanlar ve katlar' },
  { lesson_id: 'lgs-mat', name: 'Tam Sayılar', description: 'Tam sayılarla toplama, çıkarma, çarpma, bölme' },
  { lesson_id: 'lgs-mat', name: 'Rasyonel Sayılar', description: 'Rasyonel sayılarla işlemler, ondalık gösterim' },
  { lesson_id: 'lgs-mat', name: 'Cebirsel İfadeler', description: 'Cebirsel ifadeler, denklemler, eşitsizlikler' },
  { lesson_id: 'lgs-mat', name: 'Doğrusal Denklemler', description: 'Birinci dereceden bir bilinmeyenli denklemler' },
  { lesson_id: 'lgs-mat', name: 'Doğrusal İlişkiler', description: 'Doğrusal ilişkiler, grafikler, tablolar' },
  { lesson_id: 'lgs-mat', name: 'Eşitsizlikler', description: 'Birinci dereceden bir bilinmeyenli eşitsizlikler' },
  { lesson_id: 'lgs-mat', name: 'Üslü İfadeler', description: 'Tam sayıların kuvvetleri, üslü ifadelerle işlemler' },
  { lesson_id: 'lgs-mat', name: 'Kareköklü İfadeler', description: 'Kareköklü ifadeler, kareköklü ifadelerle işlemler' },
  { lesson_id: 'lgs-mat', name: 'Veri Analizi', description: 'Aritmetik ortalama, açıklık, medyan, tepe değer' },
  { lesson_id: 'lgs-mat', name: 'Basit Olayların Olasılığı', description: 'Olasılık kavramı, basit olayların olasılığı' },
  { lesson_id: 'lgs-mat', name: 'Geometrik Cisimler', description: 'Prizmalar, piramitler, koni, küre' },
  { lesson_id: 'lgs-mat', name: 'Dönüşüm Geometrisi', description: 'Öteleme, yansıma, dönme, örüntü ve süslemeler' },
  { lesson_id: 'lgs-mat', name: 'Geometrik Kavramlar', description: 'Açılar, üçgenler, dörtgenler, çokgenler' },
  { lesson_id: 'lgs-mat', name: 'Çember ve Daire', description: 'Çember, daire, çemberin çevresi, dairenin alanı' },
  { lesson_id: 'lgs-mat', name: 'Geometrik Ölçme', description: 'Çevre, alan, hacim hesaplamaları' },

  // LGS Türkçe Konuları (2025 Güncel)
  { lesson_id: 'lgs-turkce', name: 'Okuma', description: 'Ana düşünce, yardımcı düşünce, anlatım teknikleri' },
  { lesson_id: 'lgs-turkce', name: 'Paragraf', description: 'Paragraf yapısı, paragraf türleri, anlatım biçimleri' },
  { lesson_id: 'lgs-turkce', name: 'Dil Bilgisi', description: 'Fiiller, fiilimsiler, cümle türleri, cümle öğeleri' },
  { lesson_id: 'lgs-turkce', name: 'Yazım Kuralları', description: 'Büyük harflerin kullanımı, noktalama işaretleri' },
  { lesson_id: 'lgs-turkce', name: 'Anlatım Bozuklukları', description: 'Dil yanlışları, anlatım hataları, mantık hataları' },
  { lesson_id: 'lgs-turkce', name: 'Sözcükte Anlam', description: 'Gerçek anlam, mecaz anlam, terim anlam' },
  { lesson_id: 'lgs-turkce', name: 'Cümlede Anlam', description: 'Cümle yorumlama, cümle tamamlama' },
  { lesson_id: 'lgs-turkce', name: 'Parçada Anlam', description: 'Paragraf yorumlama, paragraf tamamlama' },
  { lesson_id: 'lgs-turkce', name: 'Ses Bilgisi', description: 'Ses olayları, yazım kuralları' },

  // LGS Fen Bilimleri Konuları (2025 Güncel)
  { lesson_id: 'lgs-fen', name: 'Kuvvet ve Hareket', description: 'Kuvvet, hareket, enerji, sürtünme kuvveti' },
  { lesson_id: 'lgs-fen', name: 'Elektrik', description: 'Elektrik yükleri, elektrik akımı, elektrik devreleri' },
  { lesson_id: 'lgs-fen', name: 'Enerji Dönüşümleri', description: 'Enerji türleri, enerji dönüşümleri, enerji tasarrufu' },
  { lesson_id: 'lgs-fen', name: 'Madde ve Isı', description: 'Maddenin tanecikli yapısı, ısı, sıcaklık' },
  { lesson_id: 'lgs-fen', name: 'Işık ve Ses', description: 'Işığın yayılması, ses, sesin yayılması' },
  { lesson_id: 'lgs-fen', name: 'Maddenin Yapısı', description: 'Atom, element, bileşik, karışım' },
  { lesson_id: 'lgs-fen', name: 'Kimyasal Tepkimeler', description: 'Fiziksel ve kimyasal değişimler' },
  { lesson_id: 'lgs-fen', name: 'Asitler ve Bazlar', description: 'Asit, baz, pH, nötrleşme' },
  { lesson_id: 'lgs-fen', name: 'Karışımlar', description: 'Homojen ve heterojen karışımlar, çözeltiler' },
  { lesson_id: 'lgs-fen', name: 'Hücre', description: 'Hücre yapısı, hücre organelleri' },
  { lesson_id: 'lgs-fen', name: 'Sistemler', description: 'Sindirim, dolaşım, solunum, boşaltım sistemleri' },
  { lesson_id: 'lgs-fen', name: 'Üreme', description: 'Eşeysiz üreme, eşeyli üreme, büyüme ve gelişme' },
  { lesson_id: 'lgs-fen', name: 'Genetik', description: 'Kalıtım, genetik mühendisliği' },
  { lesson_id: 'lgs-fen', name: 'Ekoloji', description: 'Ekosistem, besin zinciri, çevre sorunları' },

  // LGS Sosyal Bilgiler Konuları (2025 Güncel)
  { lesson_id: 'lgs-sosyal', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı, Cumhuriyet dönemi' },
  { lesson_id: 'lgs-sosyal', name: 'Osmanlı Tarihi', description: 'Osmanlı Devleti kuruluş, yükselme, gerileme' },
  { lesson_id: 'lgs-sosyal', name: 'Türkiye Coğrafyası', description: 'Türkiye\'nin fiziki ve beşeri coğrafyası' },
  { lesson_id: 'lgs-sosyal', name: 'Dünya Coğrafyası', description: 'Kıtalar, okyanuslar, iklim kuşakları' },
  { lesson_id: 'lgs-sosyal', name: 'Vatandaşlık', description: 'Demokrasi, haklar, sorumluluklar, anayasa' },
  { lesson_id: 'lgs-sosyal', name: 'Güncel Olaylar', description: 'Güncel siyasi, ekonomik, sosyal olaylar' },

  // LGS İngilizce Konuları (2025 Güncel)
  { lesson_id: 'lgs-ing', name: 'Grammar', description: 'Temel dilbilgisi kuralları, zamanlar' },
  { lesson_id: 'lgs-ing', name: 'Vocabulary', description: 'Kelime bilgisi, günlük hayat kelimeleri' },
  { lesson_id: 'lgs-ing', name: 'Reading', description: 'Okuma anlama, metin yorumlama' },
  { lesson_id: 'lgs-ing', name: 'Communication', description: 'Günlük konuşma kalıpları, iletişim' }
];

async function addLGSTopics() {
  console.log('LGS konuları ekleniyor...');
  
  for (const topic of lgsTopics) {
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
  
  console.log('LGS konuları ekleme işlemi tamamlandı!');
}

// Scripti çalıştır
addLGSTopics(); 