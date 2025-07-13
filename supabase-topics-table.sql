-- Önce mevcut tabloyu sil (eğer varsa)
DROP TABLE IF EXISTS topics;

-- Topics tablosunu oluştur
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_topics_lesson_id ON topics(lesson_id);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Tüm kullanıcıların okuma ve yazma yapabilmesi için policy
CREATE POLICY "Topics are viewable by everyone" ON topics FOR SELECT USING (true);
CREATE POLICY "Topics are insertable by everyone" ON topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Topics are updatable by everyone" ON topics FOR UPDATE USING (true);
CREATE POLICY "Topics are deletable by everyone" ON topics FOR DELETE USING (true);

-- Örnek veriler ekle (2025 müfredat konuları)
INSERT INTO topics (lesson_id, name, description) VALUES
-- LGS Matematik
('lgs-mat', 'Sayılar ve İşlemler', 'Doğal sayılar, tam sayılar, rasyonel sayılar'),
('lgs-mat', 'Cebirsel İfadeler', 'Değişkenler, denklemler, eşitsizlikler'),
('lgs-mat', 'Geometri', 'Açılar, üçgenler, dörtgenler, çokgenler'),
('lgs-mat', 'Veri İşleme', 'Grafikler, istatistik, olasılık'),
('lgs-mat', 'Uzamsal İlişkiler', 'Koordinat sistemi, simetri, dönüşümler'),
('lgs-mat', 'Oran ve Orantı', 'Yüzde, faiz, karışım problemleri'),
('lgs-mat', 'Hız Problemleri', 'Hareket, zaman, mesafe problemleri'),
('lgs-mat', 'Karışım Problemleri', 'Yüzde, oran, karışım hesaplamaları'),

-- LGS Türkçe
('lgs-turkce', 'Okuma', 'Paragraf, anlam, yorumlama'),
('lgs-turkce', 'Yazma', 'Kompozisyon, anlatım teknikleri'),
('lgs-turkce', 'Dil Bilgisi', 'Ses bilgisi, şekil bilgisi, cümle bilgisi'),
('lgs-turkce', 'Anlatım Bozuklukları', 'Cümle düzeyinde anlatım bozuklukları'),
('lgs-turkce', 'Noktalama ve Yazım', 'Noktalama işaretleri, yazım kuralları'),
('lgs-turkce', 'Sözcükte Anlam', 'Gerçek, mecaz, terim anlam'),
('lgs-turkce', 'Cümlede Anlam', 'Cümle çeşitleri, anlam ilişkileri'),
('lgs-turkce', 'Paragraf', 'Paragraf yapısı, anlatım teknikleri'),

-- LGS Fen Bilimleri
('lgs-fen', 'Fizik', 'Kuvvet ve hareket, enerji, ışık ve ses'),
('lgs-fen', 'Kimya', 'Madde ve özellikleri, karışımlar, asit-baz'),
('lgs-fen', 'Biyoloji', 'Canlılar ve yaşam, vücudumuz, ekosistem'),
('lgs-fen', 'Yer Bilimi', 'Dünya ve evren, hava olayları'),
('lgs-fen', 'Enerji Dönüşümleri', 'Enerji çeşitleri, dönüşümleri'),
('lgs-fen', 'Elektrik', 'Elektrik devreleri, manyetizma'),
('lgs-fen', 'Karışımlar', 'Çözeltiler, ayırma yöntemleri'),
('lgs-fen', 'Kimyasal Değişimler', 'Tepkimeler, asit-baz tepkimeleri'),

-- LGS Sosyal Bilgiler
('lgs-sosyal', 'Tarih', 'İnkılap tarihi, Atatürk dönemi'),
('lgs-sosyal', 'Coğrafya', 'Türkiye coğrafyası, iklim, nüfus'),
('lgs-sosyal', 'Vatandaşlık', 'Demokrasi, haklar, sorumluluklar'),
('lgs-sosyal', 'Din Kültürü', 'İnanç, ibadet, ahlak, kültür'),
('lgs-sosyal', 'İnkılap Tarihi', 'Kurtuluş Savaşı, Cumhuriyet dönemi'),
('lgs-sosyal', 'Türkiye Coğrafyası', 'Fiziki coğrafya, beşeri coğrafya'),
('lgs-sosyal', 'Demokrasi', 'Demokratik değerler, katılım'),
('lgs-sosyal', 'Kültür ve Miras', 'Türk kültürü, tarihi miras'),

-- LGS İngilizce
('lgs-ing', 'Kelime Bilgisi', 'Temel kelimeler, günlük konuşma'),
('lgs-ing', 'Dil Bilgisi', 'Temel gramer kuralları'),
('lgs-ing', 'Okuma', 'Metin anlama, yorumlama'),
('lgs-ing', 'Dinleme', 'Sesli metinleri anlama'),
('lgs-ing', 'Yazma', 'Basit cümleler, kısa metinler'),
('lgs-ing', 'Konuşma', 'Günlük konuşma kalıpları'),
('lgs-ing', 'Zamanlar', 'Present, past, future tenses'),
('lgs-ing', 'Cümle Yapıları', 'Basit, bileşik cümleler'),

-- TYT Matematik
('tyt-mat', 'Sayılar', 'Doğal sayılar, tam sayılar, rasyonel sayılar, reel sayılar'),
('tyt-mat', 'Cebir', 'Denklemler, eşitsizlikler, fonksiyonlar'),
('tyt-mat', 'Geometri', 'Açılar, üçgenler, dörtgenler, çokgenler, daire'),
('tyt-mat', 'Analitik Geometri', 'Koordinat sistemi, doğru denklemi, çember'),
('tyt-mat', 'Trigonometri', 'Trigonometrik fonksiyonlar, özdeşlikler'),
('tyt-mat', 'Logaritma', 'Logaritma tanımı, özellikleri, denklemler'),
('tyt-mat', 'Olasılık', 'Temel olasılık, koşullu olasılık'),
('tyt-mat', 'İstatistik', 'Merkezi eğilim, dağılım ölçüleri'),

-- TYT Türkçe
('tyt-turkce', 'Paragraf', 'Paragraf yapısı, anlatım teknikleri'),
('tyt-turkce', 'Anlam Bilgisi', 'Sözcükte, cümlede, paragrafta anlam'),
('tyt-turkce', 'Dil Bilgisi', 'Ses bilgisi, şekil bilgisi, cümle bilgisi'),
('tyt-turkce', 'Anlatım Bozuklukları', 'Cümle düzeyinde anlatım bozuklukları'),
('tyt-turkce', 'Yazım Kuralları', 'Noktalama işaretleri, yazım kuralları'),
('tyt-turkce', 'Edebiyat Bilgileri', 'Türk edebiyatı, dünya edebiyatı'),
('tyt-turkce', 'Ses Bilgisi', 'Ses olayları, ses uyumları'),
('tyt-turkce', 'Kelime Yapısı', 'Kök, ek, yapım ekleri, çekim ekleri'),

-- TYT Fen Bilimleri
('tyt-fen', 'Fizik', 'Mekanik, elektrik, optik, dalgalar'),
('tyt-fen', 'Kimya', 'Madde ve özellikleri, karışımlar, tepkimeler'),
('tyt-fen', 'Biyoloji', 'Hücre, genetik, ekoloji, sistemler'),
('tyt-fen', 'Enerji', 'Enerji çeşitleri, dönüşümleri, korunumu'),
('tyt-fen', 'Elektrik', 'Elektrik devreleri, manyetizma, elektromanyetizma'),
('tyt-fen', 'Karışımlar', 'Çözeltiler, ayırma yöntemleri, derişim'),
('tyt-fen', 'Kimyasal Tepkimeler', 'Asit-baz tepkimeleri, redoks tepkimeleri'),
('tyt-fen', 'Genetik', 'Kalıtım, genetik hastalıklar, biyoteknoloji'),

-- TYT Sosyal Bilimler
('tyt-sosyal', 'Tarih', 'İnkılap tarihi, Atatürk dönemi, çağdaş tarih'),
('tyt-sosyal', 'Coğrafya', 'Türkiye coğrafyası, dünya coğrafyası'),
('tyt-sosyal', 'Felsefe', 'Felsefe bilimi, varlık, bilgi, ahlak felsefesi'),
('tyt-sosyal', 'Din Kültürü', 'İnanç, ibadet, ahlak, kültür, dinler tarihi'),
('tyt-sosyal', 'İnkılap Tarihi', 'Kurtuluş Savaşı, Cumhuriyet dönemi'),
('tyt-sosyal', 'Türkiye Coğrafyası', 'Fiziki coğrafya, beşeri coğrafya, ekonomik coğrafya'),
('tyt-sosyal', 'Demokrasi', 'Demokratik değerler, katılım, haklar'),
('tyt-sosyal', 'Kültür ve Miras', 'Türk kültürü, tarihi miras, kültürel değerler'),

-- AYT Matematik
('ayt-mat', 'Sayılar', 'Karmaşık sayılar, reel sayılar, sayı sistemleri'),
('ayt-mat', 'Cebir', 'Polinomlar, denklemler, eşitsizlikler, fonksiyonlar'),
('ayt-mat', 'Geometri', 'Açılar, üçgenler, dörtgenler, çokgenler, daire, küre'),
('ayt-mat', 'Analitik Geometri', 'Koordinat sistemi, doğru, çember, elips, hiperbol, parabol'),
('ayt-mat', 'Trigonometri', 'Trigonometrik fonksiyonlar, özdeşlikler, denklemler'),
('ayt-mat', 'Logaritma', 'Logaritma tanımı, özellikleri, denklemler, eşitsizlikler'),
('ayt-mat', 'Limit ve Süreklilik', 'Limit tanımı, süreklilik, türev'),
('ayt-mat', 'Türev', 'Türev tanımı, türev kuralları, uygulamaları'),
('ayt-mat', 'İntegral', 'İntegral tanımı, integral kuralları, uygulamaları'),
('ayt-mat', 'Olasılık', 'Temel olasılık, koşullu olasılık, permütasyon, kombinasyon'),
('ayt-mat', 'İstatistik', 'Merkezi eğilim, dağılım ölçüleri, normal dağılım'),

-- AYT Fizik
('ayt-fizik', 'Mekanik', 'Kuvvet, hareket, enerji, momentum, dönme hareketi'),
('ayt-fizik', 'Elektrik', 'Elektrik yükü, elektrik alanı, elektrik potansiyeli'),
('ayt-fizik', 'Manyetizma', 'Manyetik alan, manyetik kuvvet, elektromanyetizma'),
('ayt-fizik', 'Optik', 'Işık, yansıma, kırılma, mercekler, aynalar'),
('ayt-fizik', 'Dalgalar', 'Dalga hareketi, ses dalgaları, ışık dalgaları'),
('ayt-fizik', 'Modern Fizik', 'Atom fiziği, nükleer fizik, kuantum fiziği'),
('ayt-fizik', 'Termodinamik', 'Isı, sıcaklık, enerji, entropi'),
('ayt-fizik', 'Akışkanlar', 'Basınç, hidrostatik, aerodinamik'),

-- AYT Kimya
('ayt-kimya', 'Madde ve Özellikleri', 'Atom yapısı, periyodik sistem, kimyasal bağlar'),
('ayt-kimya', 'Karışımlar', 'Çözeltiler, derişim, ayırma yöntemleri'),
('ayt-kimya', 'Gazlar', 'Gaz kanunları, ideal gaz denklemi, kinetik teori'),
('ayt-kimya', 'Enerji', 'Termokimya, entalpi, entropi, serbest enerji'),
('ayt-kimya', 'Reaksiyon Hızı', 'Hız denklemi, katalizör, aktivasyon enerjisi'),
('ayt-kimya', 'Kimyasal Denge', 'Denge sabiti, Le Chatelier prensibi'),
('ayt-kimya', 'Asit-Baz', 'pH, pOH, tampon çözeltiler, titrasyon'),
('ayt-kimya', 'Redoks', 'Yükseltgenme, indirgenme, elektrokimya'),
('ayt-kimya', 'Organik Kimya', 'Hidrokarbonlar, fonksiyonel gruplar, tepkimeler'),

-- AYT Biyoloji
('ayt-biyoloji', 'Hücre', 'Hücre yapısı, organeller, hücre bölünmesi'),
('ayt-biyoloji', 'Genetik', 'Kalıtım, genetik hastalıklar, biyoteknoloji'),
('ayt-biyoloji', 'Evrim', 'Evrim teorisi, doğal seçilim, adaptasyon'),
('ayt-biyoloji', 'Ekoloji', 'Popülasyon, topluluk, ekosistem'),
('ayt-biyoloji', 'Sistemler', 'Sindirim, dolaşım, solunum, boşaltım'),
('ayt-biyoloji', 'Sinir Sistemi', 'Nöronlar, sinaps, refleks, hormonlar'),
('ayt-biyoloji', 'Üreme Sistemi', 'Eşeyli üreme, embriyonik gelişim'),
('ayt-biyoloji', 'Bağışıklık', 'Bağışıklık sistemi, hastalıklar, aşılar'),
('ayt-biyoloji', 'Beslenme', 'Besin maddeleri, vitaminler, mineraller'),

-- AYT Edebiyat
('ayt-edebiyat', 'Türk Edebiyatı Tarihi', 'Eski Türk edebiyatı, divan edebiyatı, halk edebiyatı'),
('ayt-edebiyat', 'Cumhuriyet Dönemi', 'Cumhuriyet dönemi edebiyatı, akımlar, yazarlar'),
('ayt-edebiyat', 'Edebiyat Bilgileri', 'Edebi türler, sanat akımları, edebi sanatlar'),
('ayt-edebiyat', 'Dünya Edebiyatı', 'Dünya edebiyatı, yazarlar, eserler'),
('ayt-edebiyat', 'Roman', 'Roman türü, roman teknikleri, roman analizi'),
('ayt-edebiyat', 'Şiir', 'Şiir türleri, şiir teknikleri, şiir analizi'),
('ayt-edebiyat', 'Tiyatro', 'Tiyatro türleri, oyun yazarları, sahne sanatları'),
('ayt-edebiyat', 'Öykü ve Anı', 'Öykü türü, anı türü, deneme türü'),

-- AYT Tarih
('ayt-tarih', 'Osmanlı Tarihi', 'Osmanlı kuruluş, yükselme, gerileme dönemleri'),
('ayt-tarih', 'İnkılap Tarihi', 'Kurtuluş Savaşı, Cumhuriyet dönemi'),
('ayt-tarih', 'Çağdaş Türk Tarihi', 'Atatürk dönemi, çok partili hayat'),
('ayt-tarih', 'Dünya Tarihi', 'Avrupa tarihi, dünya savaşları, soğuk savaş'),
('ayt-tarih', 'İlk Çağ', 'Anadolu uygarlıkları, eski çağ medeniyetleri'),
('ayt-tarih', 'Orta Çağ', 'Orta Çağ Avrupası, İslam tarihi'),
('ayt-tarih', 'Yeni Çağ', 'Coğrafi keşifler, reform, rönesans'),
('ayt-tarih', 'Yakın Çağ', 'Fransız ihtilali, sanayi devrimi'),

-- AYT Coğrafya
('ayt-cografya', 'Fiziki Coğrafya', 'İklim, yer şekilleri, toprak, bitki örtüsü'),
('ayt-cografya', 'Beşeri Coğrafya', 'Nüfus, yerleşme, göç, ekonomik faaliyetler'),
('ayt-cografya', 'Ekonomik Coğrafya', 'Tarım, sanayi, hizmetler, ticaret'),
('ayt-cografya', 'Türkiye Coğrafyası', 'Türkiye''nin fiziki ve beşeri coğrafyası'),
('ayt-cografya', 'Dünya Coğrafyası', 'Kıtalar, ülkeler, bölgeler'),
('ayt-cografya', 'Çevre Coğrafyası', 'Çevre sorunları, sürdürülebilirlik'),
('ayt-cografya', 'Enerji Kaynakları', 'Yenilenebilir ve yenilenemez enerji'),
('ayt-cografya', 'Doğal Afetler', 'Deprem, sel, kuraklık, çığ'),

-- AYT Felsefe
('ayt-felsefe', 'Felsefe Bilimi', 'Felsefe tanımı, felsefi düşünce, metodoloji'),
('ayt-felsefe', 'Varlık Felsefesi', 'Varlık problemi, ontoloji, metafizik'),
('ayt-felsefe', 'Bilgi Felsefesi', 'Bilgi problemi, epistemoloji, doğruluk'),
('ayt-felsefe', 'Ahlak Felsefesi', 'Ahlak problemi, etik, değerler'),
('ayt-felsefe', 'Sanat Felsefesi', 'Estetik, güzellik, sanat eseri'),
('ayt-felsefe', 'Din Felsefesi', 'Din problemi, teoloji, inanç'),
('ayt-felsefe', 'Siyaset Felsefesi', 'Devlet, iktidar, adalet, özgürlük'),
('ayt-felsefe', 'Bilim Felsefesi', 'Bilimsel yöntem, bilimsel devrim'),

-- KPSS Genel Yetenek
('kpss-gy', 'Türkçe', 'Dil bilgisi, anlam bilgisi, paragraf'),
('kpss-gy', 'Matematik', 'Sayılar, cebir, geometri, problemler'),
('kpss-gy', 'Geometri', 'Açılar, üçgenler, dörtgenler, çokgenler'),
('kpss-gy', 'Problemler', 'Sayı problemleri, yaş problemleri, işçi problemleri'),
('kpss-gy', 'Olasılık', 'Temel olasılık, permütasyon, kombinasyon'),
('kpss-gy', 'İstatistik', 'Merkezi eğilim, dağılım ölçüleri'),
('kpss-gy', 'Mantık', 'Mantık kuralları, akıl yürütme'),
('kpss-gy', 'Dikkat', 'Dikkat ve konsantrasyon soruları'),

-- KPSS Genel Kültür
('kpss-gk', 'Tarih', 'Osmanlı tarihi, inkılap tarihi, çağdaş tarih'),
('kpss-gk', 'Coğrafya', 'Türkiye coğrafyası, dünya coğrafyası'),
('kpss-gk', 'Vatandaşlık', 'Anayasa, temel haklar, demokrasi'),
('kpss-gk', 'Güncel Bilgiler', 'Güncel olaylar, ekonomi, siyaset'),
('kpss-gk', 'Kültür ve Miras', 'Türk kültürü, tarihi miras'),
('kpss-gk', 'İnkılap Tarihi', 'Kurtuluş Savaşı, Cumhuriyet dönemi'),
('kpss-gk', 'Türkiye Coğrafyası', 'Fiziki coğrafya, beşeri coğrafya'),
('kpss-gk', 'Demokrasi', 'Demokratik değerler, katılım, haklar'),

-- KPSS Eğitim Bilimleri
('kpss-egitim', 'Eğitim Psikolojisi', 'Gelişim psikolojisi, öğrenme psikolojisi'),
('kpss-egitim', 'Program Geliştirme', 'Eğitim programları, müfredat tasarımı'),
('kpss-egitim', 'Öğretim Yöntemleri', 'Öğretim teknikleri, öğrenme yöntemleri'),
('kpss-egitim', 'Ölçme ve Değerlendirme', 'Test geliştirme, değerlendirme teknikleri'),
('kpss-egitim', 'Rehberlik', 'Psikolojik danışmanlık, rehberlik hizmetleri'),
('kpss-egitim', 'Gelişim Psikolojisi', 'Çocuk gelişimi, ergenlik, yetişkinlik'),
('kpss-egitim', 'Öğrenme Psikolojisi', 'Öğrenme kuramları, motivasyon'),
('kpss-egitim', 'Sınıf Yönetimi', 'Sınıf disiplini, öğrenci davranışları'),

-- KPSS ÖABT
('kpss-oabt', 'Alan Bilgisi', 'Branşa özel alan bilgisi'),
('kpss-oabt', 'Pedagojik Formasyon', 'Öğretmenlik mesleği, eğitim bilimleri'),
('kpss-oabt', 'Müfredat Bilgisi', 'Branş müfredatı, konu dağılımı'),
('kpss-oabt', 'Öğretim Yöntemleri', 'Branşa özel öğretim teknikleri'),
('kpss-oabt', 'Materyal Geliştirme', 'Öğretim materyalleri, araç-gereç'),
('kpss-oabt', 'Değerlendirme', 'Branşa özel değerlendirme teknikleri'),
('kpss-oabt', 'Eğitim Teknolojisi', 'Teknoloji kullanımı, dijital araçlar'),
('kpss-oabt', 'Proje Tabanlı Öğrenme', 'Proje çalışmaları, araştırma yöntemleri'); 