"use client";
import { useState } from "react";

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface TopicsPageProps {
  lesson: Lesson;
  onBack: () => void;
  onTopicSelect: (topic: Topic) => void;
}

export default function TopicsPage({ lesson, onBack, onTopicSelect }: TopicsPageProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");
  const [dynamicTopics, setDynamicTopics] = useState<{ id: string; name: string; description?: string }[]>([]);

  // Tüm Konular - 2025 Müfredat
  const staticTopics: Record<string, { id: string; name: string; description?: string }[]> = {
    // LGS Konuları
    'lgs-mat': [
      { id: 'lgs-mat-sayilar', name: 'Sayılar ve İşlemler', description: 'Doğal sayılar, tam sayılar, rasyonel sayılar' },
      { id: 'lgs-mat-cebir', name: 'Cebirsel İfadeler', description: 'Değişkenler, denklemler, eşitsizlikler' },
      { id: 'lgs-mat-geometri', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çokgenler' },
      { id: 'lgs-mat-veri', name: 'Veri İşleme', description: 'Grafikler, istatistik, olasılık' },
      { id: 'lgs-mat-uzay', name: 'Uzamsal İlişkiler', description: 'Koordinat sistemi, simetri, dönüşümler' },
      { id: 'lgs-mat-oran', name: 'Oran ve Orantı', description: 'Yüzde, faiz, karışım problemleri' },
      { id: 'lgs-mat-hiz', name: 'Hız Problemleri', description: 'Hareket, zaman, mesafe problemleri' },
      { id: 'lgs-mat-kar', name: 'Karışım Problemleri', description: 'Yüzde, oran, karışım hesaplamaları' }
    ],
    'lgs-turkce': [
      { id: 'lgs-turkce-okuma', name: 'Okuma', description: 'Paragraf, anlam, yorumlama' },
      { id: 'lgs-turkce-yazma', name: 'Yazma', description: 'Kompozisyon, anlatım teknikleri' },
      { id: 'lgs-turkce-dilbilgisi', name: 'Dil Bilgisi', description: 'Ses bilgisi, şekil bilgisi, cümle bilgisi' },
      { id: 'lgs-turkce-anlatim', name: 'Anlatım Bozuklukları', description: 'Cümle düzeyinde anlatım bozuklukları' },
      { id: 'lgs-turkce-noktalama', name: 'Noktalama ve Yazım', description: 'Noktalama işaretleri, yazım kuralları' },
      { id: 'lgs-turkce-sozcuk', name: 'Sözcükte Anlam', description: 'Gerçek, mecaz, terim anlam' },
      { id: 'lgs-turkce-cumle', name: 'Cümlede Anlam', description: 'Cümle çeşitleri, anlam ilişkileri' },
      { id: 'lgs-turkce-paragraf', name: 'Paragraf', description: 'Paragraf yapısı, anlatım teknikleri' }
    ],
    'lgs-fen': [
      { id: 'lgs-fen-fizik', name: 'Fizik', description: 'Kuvvet ve hareket, enerji, ışık ve ses' },
      { id: 'lgs-fen-kimya', name: 'Kimya', description: 'Madde ve özellikleri, karışımlar, asit-baz' },
      { id: 'lgs-fen-biyoloji', name: 'Biyoloji', description: 'Canlılar ve yaşam, vücudumuz, ekosistem' },
      { id: 'lgs-fen-yer', name: 'Yer Bilimi', description: 'Dünya ve evren, hava olayları' },
      { id: 'lgs-fen-enerji', name: 'Enerji Dönüşümleri', description: 'Enerji çeşitleri, dönüşümleri' },
      { id: 'lgs-fen-elektrik', name: 'Elektrik', description: 'Elektrik devreleri, manyetizma' },
      { id: 'lgs-fen-karisma', name: 'Karışımlar', description: 'Çözeltiler, ayırma yöntemleri' },
      { id: 'lgs-fen-kimyasal', name: 'Kimyasal Değişimler', description: 'Tepkimeler, asit-baz tepkimeleri' }
    ],
    'lgs-sosyal': [
      { id: 'lgs-sosyal-tarih', name: 'Tarih', description: 'İnkılap tarihi, Atatürk dönemi' },
      { id: 'lgs-sosyal-cografya', name: 'Coğrafya', description: 'Türkiye coğrafyası, iklim, nüfus' },
      { id: 'lgs-sosyal-vatandaslik', name: 'Vatandaşlık', description: 'Demokrasi, haklar, sorumluluklar' },
      { id: 'lgs-sosyal-din', name: 'Din Kültürü', description: 'İnanç, ibadet, ahlak, kültür' },
      { id: 'lgs-sosyal-inkilap', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı, Cumhuriyet dönemi' },
      { id: 'lgs-sosyal-turkiye', name: 'Türkiye Coğrafyası', description: 'Fiziki coğrafya, beşeri coğrafya' },
      { id: 'lgs-sosyal-demokrasi', name: 'Demokrasi', description: 'Demokratik değerler, katılım' },
      { id: 'lgs-sosyal-kultur', name: 'Kültür ve Miras', description: 'Türk kültürü, tarihi miras' }
    ],
    'lgs-ing': [
      { id: 'lgs-ing-kelime', name: 'Kelime Bilgisi', description: 'Temel kelimeler, günlük konuşma' },
      { id: 'lgs-ing-gramer', name: 'Dil Bilgisi', description: 'Temel gramer kuralları' },
      { id: 'lgs-ing-okuma', name: 'Okuma', description: 'Metin anlama, yorumlama' },
      { id: 'lgs-ing-dinleme', name: 'Dinleme', description: 'Sesli metinleri anlama' },
      { id: 'lgs-ing-yazma', name: 'Yazma', description: 'Basit cümleler, kısa metinler' },
      { id: 'lgs-ing-konusma', name: 'Konuşma', description: 'Günlük konuşma kalıpları' },
      { id: 'lgs-ing-zaman', name: 'Zamanlar', description: 'Present, past, future tenses' },
      { id: 'lgs-ing-cumle', name: 'Cümle Yapıları', description: 'Basit, bileşik cümleler' }
    ],
    
    // TYT Konuları
    'tyt-mat': [
      { id: 'tyt-mat-sayilar', name: 'Sayılar', description: 'Doğal sayılar, tam sayılar, rasyonel sayılar, reel sayılar' },
      { id: 'tyt-mat-cebir', name: 'Cebir', description: 'Denklemler, eşitsizlikler, fonksiyonlar' },
      { id: 'tyt-mat-geometri', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çokgenler, daire' },
      { id: 'tyt-mat-analitik', name: 'Analitik Geometri', description: 'Koordinat sistemi, doğru denklemi, çember' },
      { id: 'tyt-mat-trigonometri', name: 'Trigonometri', description: 'Trigonometrik fonksiyonlar, özdeşlikler' },
      { id: 'tyt-mat-logaritma', name: 'Logaritma', description: 'Logaritma tanımı, özellikleri, denklemler' },
      { id: 'tyt-mat-olasilik', name: 'Olasılık', description: 'Temel olasılık, koşullu olasılık' },
      { id: 'tyt-mat-istatistik', name: 'İstatistik', description: 'Merkezi eğilim, dağılım ölçüleri' }
    ],
    'tyt-turkce': [
      { id: 'tyt-turkce-paragraf', name: 'Paragraf', description: 'Paragraf yapısı, anlatım teknikleri' },
      { id: 'tyt-turkce-anlam', name: 'Anlam Bilgisi', description: 'Sözcükte, cümlede, paragrafta anlam' },
      { id: 'tyt-turkce-dilbilgisi', name: 'Dil Bilgisi', description: 'Ses bilgisi, şekil bilgisi, cümle bilgisi' },
      { id: 'tyt-turkce-anlatim', name: 'Anlatım Bozuklukları', description: 'Cümle düzeyinde anlatım bozuklukları' },
      { id: 'tyt-turkce-yazim', name: 'Yazım Kuralları', description: 'Noktalama işaretleri, yazım kuralları' },
      { id: 'tyt-turkce-edebiyat', name: 'Edebiyat Bilgileri', description: 'Türk edebiyatı, dünya edebiyatı' },
      { id: 'tyt-turkce-ses', name: 'Ses Bilgisi', description: 'Ses olayları, ses uyumları' },
      { id: 'tyt-turkce-kelime', name: 'Kelime Yapısı', description: 'Kök, ek, yapım ekleri, çekim ekleri' }
    ],
    'tyt-fen': [
      { id: 'tyt-fen-fizik', name: 'Fizik', description: 'Mekanik, elektrik, optik, dalgalar' },
      { id: 'tyt-fen-kimya', name: 'Kimya', description: 'Madde ve özellikleri, karışımlar, tepkimeler' },
      { id: 'tyt-fen-biyoloji', name: 'Biyoloji', description: 'Hücre, genetik, ekoloji, sistemler' },
      { id: 'tyt-fen-enerji', name: 'Enerji', description: 'Enerji çeşitleri, dönüşümleri, korunumu' },
      { id: 'tyt-fen-elektrik', name: 'Elektrik', description: 'Elektrik devreleri, manyetizma, elektromanyetizma' },
      { id: 'tyt-fen-karisma', name: 'Karışımlar', description: 'Çözeltiler, ayırma yöntemleri, derişim' },
      { id: 'tyt-fen-kimyasal', name: 'Kimyasal Tepkimeler', description: 'Asit-baz tepkimeleri, redoks tepkimeleri' },
      { id: 'tyt-fen-genetik', name: 'Genetik', description: 'Kalıtım, genetik hastalıklar, biyoteknoloji' }
    ],
    'tyt-sosyal': [
      { id: 'tyt-sosyal-tarih', name: 'Tarih', description: 'İnkılap tarihi, Atatürk dönemi, çağdaş tarih' },
      { id: 'tyt-sosyal-cografya', name: 'Coğrafya', description: 'Türkiye coğrafyası, dünya coğrafyası' },
      { id: 'tyt-sosyal-felsefe', name: 'Felsefe', description: 'Felsefe bilimi, varlık, bilgi, ahlak felsefesi' },
      { id: 'tyt-sosyal-din', name: 'Din Kültürü', description: 'İnanç, ibadet, ahlak, kültür, dinler tarihi' },
      { id: 'tyt-sosyal-inkilap', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı, Cumhuriyet dönemi' },
      { id: 'tyt-sosyal-turkiye', name: 'Türkiye Coğrafyası', description: 'Fiziki coğrafya, beşeri coğrafya, ekonomik coğrafya' },
      { id: 'tyt-sosyal-demokrasi', name: 'Demokrasi', description: 'Demokratik değerler, katılım, haklar' },
      { id: 'tyt-sosyal-kultur', name: 'Kültür ve Miras', description: 'Türk kültürü, tarihi miras, kültürel değerler' }
    ],
    
    // AYT Konuları
    'ayt-mat': [
      { id: 'ayt-mat-sayilar', name: 'Sayılar', description: 'Karmaşık sayılar, reel sayılar, sayı sistemleri' },
      { id: 'ayt-mat-cebir', name: 'Cebir', description: 'Polinomlar, denklemler, eşitsizlikler, fonksiyonlar' },
      { id: 'ayt-mat-geometri', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çokgenler, daire, küre' },
      { id: 'ayt-mat-analitik', name: 'Analitik Geometri', description: 'Koordinat sistemi, doğru, çember, elips, hiperbol, parabol' },
      { id: 'ayt-mat-trigonometri', name: 'Trigonometri', description: 'Trigonometrik fonksiyonlar, özdeşlikler, denklemler' },
      { id: 'ayt-mat-logaritma', name: 'Logaritma', description: 'Logaritma tanımı, özellikleri, denklemler, eşitsizlikler' },
      { id: 'ayt-mat-limit', name: 'Limit ve Süreklilik', description: 'Limit tanımı, süreklilik, türev' },
      { id: 'ayt-mat-turev', name: 'Türev', description: 'Türev tanımı, türev kuralları, uygulamaları' },
      { id: 'ayt-mat-integral', name: 'İntegral', description: 'İntegral tanımı, integral kuralları, uygulamaları' },
      { id: 'ayt-mat-olasilik', name: 'Olasılık', description: 'Temel olasılık, koşullu olasılık, permütasyon, kombinasyon' },
      { id: 'ayt-mat-istatistik', name: 'İstatistik', description: 'Merkezi eğilim, dağılım ölçüleri, normal dağılım' }
    ],
    'ayt-fizik': [
      { id: 'ayt-fizik-mekanik', name: 'Mekanik', description: 'Kuvvet, hareket, enerji, momentum, dönme hareketi' },
      { id: 'ayt-fizik-elektrik', name: 'Elektrik', description: 'Elektrik yükü, elektrik alanı, elektrik potansiyeli' },
      { id: 'ayt-fizik-manyetizma', name: 'Manyetizma', description: 'Manyetik alan, manyetik kuvvet, elektromanyetizma' },
      { id: 'ayt-fizik-optik', name: 'Optik', description: 'Işık, yansıma, kırılma, mercekler, aynalar' },
      { id: 'ayt-fizik-dalgalar', name: 'Dalgalar', description: 'Dalga hareketi, ses dalgaları, ışık dalgaları' },
      { id: 'ayt-fizik-modern', name: 'Modern Fizik', description: 'Atom fiziği, nükleer fizik, kuantum fiziği' },
      { id: 'ayt-fizik-termodinamik', name: 'Termodinamik', description: 'Isı, sıcaklık, enerji, entropi' },
      { id: 'ayt-fizik-akışkanlar', name: 'Akışkanlar', description: 'Basınç, hidrostatik, aerodinamik' }
    ],
    'ayt-kimya': [
      { id: 'ayt-kimya-madde', name: 'Madde ve Özellikleri', description: 'Atom yapısı, periyodik sistem, kimyasal bağlar' },
      { id: 'ayt-kimya-karisma', name: 'Karışımlar', description: 'Çözeltiler, derişim, ayırma yöntemleri' },
      { id: 'ayt-kimya-gazlar', name: 'Gazlar', description: 'Gaz kanunları, ideal gaz denklemi, kinetik teori' },
      { id: 'ayt-kimya-enerji', name: 'Enerji', description: 'Termokimya, entalpi, entropi, serbest enerji' },
      { id: 'ayt-kimya-hiz', name: 'Reaksiyon Hızı', description: 'Hız denklemi, katalizör, aktivasyon enerjisi' },
      { id: 'ayt-kimya-denge', name: 'Kimyasal Denge', description: 'Denge sabiti, Le Chatelier prensibi' },
      { id: 'ayt-kimya-asitbaz', name: 'Asit-Baz', description: 'pH, pOH, tampon çözeltiler, titrasyon' },
      { id: 'ayt-kimya-redoks', name: 'Redoks', description: 'Yükseltgenme, indirgenme, elektrokimya' },
      { id: 'ayt-kimya-organik', name: 'Organik Kimya', description: 'Hidrokarbonlar, fonksiyonel gruplar, tepkimeler' }
    ],
    'ayt-biyoloji': [
      { id: 'ayt-biyoloji-hucre', name: 'Hücre', description: 'Hücre yapısı, organeller, hücre bölünmesi' },
      { id: 'ayt-biyoloji-genetik', name: 'Genetik', description: 'Kalıtım, genetik hastalıklar, biyoteknoloji' },
      { id: 'ayt-biyoloji-evrim', name: 'Evrim', description: 'Evrim teorisi, doğal seçilim, adaptasyon' },
      { id: 'ayt-biyoloji-ekoloji', name: 'Ekoloji', description: 'Popülasyon, topluluk, ekosistem' },
      { id: 'ayt-biyoloji-sistemler', name: 'Sistemler', description: 'Sindirim, dolaşım, solunum, boşaltım' },
      { id: 'ayt-biyoloji-sinir', name: 'Sinir Sistemi', description: 'Nöronlar, sinaps, refleks, hormonlar' },
      { id: 'ayt-biyoloji-ureme', name: 'Üreme Sistemi', description: 'Eşeyli üreme, embriyonik gelişim' },
      { id: 'ayt-biyoloji-bagisiklik', name: 'Bağışıklık', description: 'Bağışıklık sistemi, hastalıklar, aşılar' },
      { id: 'ayt-biyoloji-beslenme', name: 'Beslenme', description: 'Besin maddeleri, vitaminler, mineraller' }
    ],
    'ayt-edebiyat': [
      { id: 'ayt-edebiyat-tarih', name: 'Türk Edebiyatı Tarihi', description: 'Eski Türk edebiyatı, divan edebiyatı, halk edebiyatı' },
      { id: 'ayt-edebiyat-cumhuriyet', name: 'Cumhuriyet Dönemi', description: 'Cumhuriyet dönemi edebiyatı, akımlar, yazarlar' },
      { id: 'ayt-edebiyat-bilgi', name: 'Edebiyat Bilgileri', description: 'Edebi türler, sanat akımları, edebi sanatlar' },
      { id: 'ayt-edebiyat-dunya', name: 'Dünya Edebiyatı', description: 'Dünya edebiyatı, yazarlar, eserler' },
      { id: 'ayt-edebiyat-roman', name: 'Roman', description: 'Roman türü, roman teknikleri, roman analizi' },
      { id: 'ayt-edebiyat-siir', name: 'Şiir', description: 'Şiir türleri, şiir teknikleri, şiir analizi' },
      { id: 'ayt-edebiyat-tiyatro', name: 'Tiyatro', description: 'Tiyatro türleri, oyun yazarları, sahne sanatları' },
      { id: 'ayt-edebiyat-ozan', name: 'Öykü ve Anı', description: 'Öykü türü, anı türü, deneme türü' }
    ],
    'ayt-tarih': [
      { id: 'ayt-tarih-osmanli', name: 'Osmanlı Tarihi', description: 'Osmanlı kuruluş, yükselme, gerileme dönemleri' },
      { id: 'ayt-tarih-inkilap', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı, Cumhuriyet dönemi' },
      { id: 'ayt-tarih-cagdas', name: 'Çağdaş Türk Tarihi', description: 'Atatürk dönemi, çok partili hayat' },
      { id: 'ayt-tarih-dunya', name: 'Dünya Tarihi', description: 'Avrupa tarihi, dünya savaşları, soğuk savaş' },
      { id: 'ayt-tarih-ilkcag', name: 'İlk Çağ', description: 'Anadolu uygarlıkları, eski çağ medeniyetleri' },
      { id: 'ayt-tarih-orta', name: 'Orta Çağ', description: 'Orta Çağ Avrupası, İslam tarihi' },
      { id: 'ayt-tarih-yeni', name: 'Yeni Çağ', description: 'Coğrafi keşifler, reform, rönesans' },
      { id: 'ayt-tarih-yakın', name: 'Yakın Çağ', description: 'Fransız ihtilali, sanayi devrimi' }
    ],
    'ayt-cografya': [
      { id: 'ayt-cografya-fiziki', name: 'Fiziki Coğrafya', description: 'İklim, yer şekilleri, toprak, bitki örtüsü' },
      { id: 'ayt-cografya-beseri', name: 'Beşeri Coğrafya', description: 'Nüfus, yerleşme, göç, ekonomik faaliyetler' },
      { id: 'ayt-cografya-ekonomik', name: 'Ekonomik Coğrafya', description: 'Tarım, sanayi, hizmetler, ticaret' },
      { id: 'ayt-cografya-turkiye', name: 'Türkiye Coğrafyası', description: 'Türkiye\'nin fiziki ve beşeri coğrafyası' },
      { id: 'ayt-cografya-dunya', name: 'Dünya Coğrafyası', description: 'Kıtalar, ülkeler, bölgeler' },
      { id: 'ayt-cografya-cevre', name: 'Çevre Coğrafyası', description: 'Çevre sorunları, sürdürülebilirlik' },
      { id: 'ayt-cografya-enerji', name: 'Enerji Kaynakları', description: 'Yenilenebilir ve yenilenemez enerji' },
      { id: 'ayt-cografya-afet', name: 'Doğal Afetler', description: 'Deprem, sel, kuraklık, çığ' }
    ],
    'ayt-felsefe': [
      { id: 'ayt-felsefe-bilim', name: 'Felsefe Bilimi', description: 'Felsefe tanımı, felsefi düşünce, metodoloji' },
      { id: 'ayt-felsefe-varlik', name: 'Varlık Felsefesi', description: 'Varlık problemi, ontoloji, metafizik' },
      { id: 'ayt-felsefe-bilgi', name: 'Bilgi Felsefesi', description: 'Bilgi problemi, epistemoloji, doğruluk' },
      { id: 'ayt-felsefe-ahlak', name: 'Ahlak Felsefesi', description: 'Ahlak problemi, etik, değerler' },
      { id: 'ayt-felsefe-sanat', name: 'Sanat Felsefesi', description: 'Estetik, güzellik, sanat eseri' },
      { id: 'ayt-felsefe-din', name: 'Din Felsefesi', description: 'Din problemi, teoloji, inanç' },
      { id: 'ayt-felsefe-siyaset', name: 'Siyaset Felsefesi', description: 'Devlet, iktidar, adalet, özgürlük' },
      { id: 'ayt-felsefe-bilimfelsefesi', name: 'Bilim Felsefesi', description: 'Bilimsel yöntem, bilimsel devrim' }
    ],
    
    // KPSS Konuları
    'kpss-gy': [
      { id: 'kpss-gy-turkce', name: 'Türkçe', description: 'Dil bilgisi, anlam bilgisi, paragraf' },
      { id: 'kpss-gy-matematik', name: 'Matematik', description: 'Sayılar, cebir, geometri, problemler' },
      { id: 'kpss-gy-geometri', name: 'Geometri', description: 'Açılar, üçgenler, dörtgenler, çokgenler' },
      { id: 'kpss-gy-problemler', name: 'Problemler', description: 'Sayı problemleri, yaş problemleri, işçi problemleri' },
      { id: 'kpss-gy-olasilik', name: 'Olasılık', description: 'Temel olasılık, permütasyon, kombinasyon' },
      { id: 'kpss-gy-istatistik', name: 'İstatistik', description: 'Merkezi eğilim, dağılım ölçüleri' },
      { id: 'kpss-gy-mantik', name: 'Mantık', description: 'Mantık kuralları, akıl yürütme' },
      { id: 'kpss-gy-dikkat', name: 'Dikkat', description: 'Dikkat ve konsantrasyon soruları' }
    ],
    'kpss-gk': [
      { id: 'kpss-gk-tarih', name: 'Tarih', description: 'Osmanlı tarihi, inkılap tarihi, çağdaş tarih' },
      { id: 'kpss-gk-cografya', name: 'Coğrafya', description: 'Türkiye coğrafyası, dünya coğrafyası' },
      { id: 'kpss-gk-vatandaslik', name: 'Vatandaşlık', description: 'Anayasa, temel haklar, demokrasi' },
      { id: 'kpss-gk-guncel', name: 'Güncel Bilgiler', description: 'Güncel olaylar, ekonomi, siyaset' },
      { id: 'kpss-gk-kultur', name: 'Kültür ve Miras', description: 'Türk kültürü, tarihi miras' },
      { id: 'kpss-gk-inkilap', name: 'İnkılap Tarihi', description: 'Kurtuluş Savaşı, Cumhuriyet dönemi' },
      { id: 'kpss-gk-turkiye', name: 'Türkiye Coğrafyası', description: 'Fiziki coğrafya, beşeri coğrafya' },
      { id: 'kpss-gk-demokrasi', name: 'Demokrasi', description: 'Demokratik değerler, katılım, haklar' }
    ],
    'kpss-egitim': [
      { id: 'kpss-egitim-psikoloji', name: 'Eğitim Psikolojisi', description: 'Gelişim psikolojisi, öğrenme psikolojisi' },
      { id: 'kpss-egitim-program', name: 'Program Geliştirme', description: 'Eğitim programları, müfredat tasarımı' },
      { id: 'kpss-egitim-yontem', name: 'Öğretim Yöntemleri', description: 'Öğretim teknikleri, öğrenme yöntemleri' },
      { id: 'kpss-egitim-olcme', name: 'Ölçme ve Değerlendirme', description: 'Test geliştirme, değerlendirme teknikleri' },
      { id: 'kpss-egitim-rehberlik', name: 'Rehberlik', description: 'Psikolojik danışmanlık, rehberlik hizmetleri' },
      { id: 'kpss-egitim-gelisim', name: 'Gelişim Psikolojisi', description: 'Çocuk gelişimi, ergenlik, yetişkinlik' },
      { id: 'kpss-egitim-ogrenme', name: 'Öğrenme Psikolojisi', description: 'Öğrenme kuramları, motivasyon' },
      { id: 'kpss-egitim-sinif', name: 'Sınıf Yönetimi', description: 'Sınıf disiplini, öğrenci davranışları' }
    ],
    'kpss-oabt': [
      { id: 'kpss-oabt-alan', name: 'Alan Bilgisi', description: 'Branşa özel alan bilgisi' },
      { id: 'kpss-oabt-pedagoji', name: 'Pedagojik Formasyon', description: 'Öğretmenlik mesleği, eğitim bilimleri' },
      { id: 'kpss-oabt-mufredat', name: 'Müfredat Bilgisi', description: 'Branş müfredatı, konu dağılımı' },
      { id: 'kpss-oabt-yontem', name: 'Öğretim Yöntemleri', description: 'Branşa özel öğretim teknikleri' },
      { id: 'kpss-oabt-materyal', name: 'Materyal Geliştirme', description: 'Öğretim materyalleri, araç-gereç' },
      { id: 'kpss-oabt-degerlendirme', name: 'Değerlendirme', description: 'Branşa özel değerlendirme teknikleri' },
      { id: 'kpss-oabt-teknoloji', name: 'Eğitim Teknolojisi', description: 'Teknoloji kullanımı, dijital araçlar' },
      { id: 'kpss-oabt-proje', name: 'Proje Tabanlı Öğrenme', description: 'Proje çalışmaları, araştırma yöntemleri' }
    ]
  };

  // Statik konuları al
  const staticTopicsForLesson = staticTopics[lesson.id] || [];
  
  // Statik ve dinamik konuları birleştir
  const allTopics = [...staticTopicsForLesson, ...dynamicTopics];

  async function handleAddTopic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) {
      setFormError("Konu adı boş olamaz.");
      return;
    }
    if (name.length > 60) {
      setFormError("Konu adı 60 karakterden uzun olamaz.");
      return;
    }
    if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s]+$/.test(name)) {
      setFormError("Konu adı sadece harf, rakam ve boşluk içerebilir.");
      return;
    }
    setAdding(true);
    try {
      // Yeni konuyu dynamicTopics listesine ekle
      const newTopic = {
        id: `${lesson.id}-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || undefined
      };
      setDynamicTopics(prev => [...prev, newTopic]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Konu eklenemedi:", err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <button onClick={onBack} className="mb-4 text-sky-600 hover:underline">&larr; Geri</button>
      <h1 className="text-2xl font-bold mb-2">{lesson.name} - Konular</h1>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Yeni Konu Ekle</h3>
        </div>
        <form onSubmit={handleAddTopic}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konu Adı</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Örn: Matematik Temelleri"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Konu hakkında kısa açıklama"
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none transition"
            />
          </div>
          {formError && <div className="text-red-500 text-center font-semibold text-sm bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={adding || !name.trim()}
          >
            {adding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Ekleniyor...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Konu Ekle
              </div>
            )}
          </button>
        </form>
      </div>
      
      {/* Statik Konular - Her zaman göster */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">2025 Müfredat Konuları</h3>
        {allTopics.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {allTopics.map((topic) => (
              <div key={topic.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer select-none p-6" onClick={() => onTopicSelect(topic)} tabIndex={0} role="button" aria-pressed="false">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 tracking-tight">{topic.name}</h3>
                </div>
                {topic.description && <p className="text-sm text-gray-600 mb-3">{topic.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Müfredat Konusu</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-yellow-600">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-yellow-800 font-medium">Bu ders için henüz konular tanımlanmamış.</span>
            </div>
            <p className="text-yellow-700 text-sm mt-2">Ders ID: {lesson.id}</p>
          </div>
        )}
      </div>
    </div>
  );
} 