import React, { useState, useRef } from 'react';

interface ProfilePageProps {
  username: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [usernameValue, setUsernameValue] = useState(username);
  const [usernameError, setUsernameError] = useState("");
  const [aboutValue, setAboutValue] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: '👤' },
    { id: 'password', name: 'Şifre', icon: '🔒' },
    { id: 'stats', name: 'İstatistikler', icon: '📊' },
    { id: 'settings', name: 'Ayarlar', icon: '⚙️' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tüm alanları doldurun.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }
    // Şifre değiştirme işlemi burada yapılacak
    alert("Şifre başarıyla değiştirildi!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                username?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-sky-600 transition-colors"
            >
              📷
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
            <p className="text-gray-600">Aktif Kullanıcı</p>
            {aboutValue && (
              <p className="text-sm text-gray-500 mt-1">{aboutValue}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={usernameValue}
                      onChange={e => {
                        const val = e.target.value;
                        setUsernameValue(val);
                        if (val.length > 20) {
                          setUsernameError("Kullanıcı adı 20 karakterden uzun olamaz.");
                        } else if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_]+$/.test(val)) {
                          setUsernameError("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.");
                        } else {
                          setUsernameError("");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      maxLength={20}
                    />
                    {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      type="email"
                      defaultValue="kullanici@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hakkında</h3>
                <textarea
                  rows={4}
                  value={aboutValue}
                  onChange={e => {
                    const val = e.target.value;
                    setAboutValue(val);
                    if (val.length > 200) {
                      setAboutError("Hakkında alanı 200 karakterden uzun olamaz.");
                    } else if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ.,!?:;()\s-]*$/.test(val)) {
                      setAboutError("Hakkında alanı geçersiz karakter içeriyor.");
                    } else {
                      setAboutError("");
                    }
                  }}
                  placeholder="Kendin hakkında kısa bir bilgi yaz..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  maxLength={200}
                />
                {aboutError && <div className="text-red-500 text-xs mt-1">{aboutError}</div>}
                <div className="text-xs text-gray-500 mt-1">{aboutValue.length}/200</div>
              </div>

              <div className="flex justify-end">
                <button className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors">
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Mevcut şifrenizi girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Yeni şifrenizi girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>
                
                {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                
                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors"
                  >
                    Şifreyi Değiştir
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı İstatistikler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="text-sm opacity-90">Toplam Çözülen Soru</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">78.2%</div>
                  <div className="text-sm opacity-90">Başarı Oranı</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm opacity-90">Günlük Seri</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Son Aktiviteler</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bugün çözülen soru</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu hafta çözülen soru</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu ay çözülen soru</span>
                    <span className="font-medium">342</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Ayarları</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
                    <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta al</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Bildirimleri</h4>
                    <p className="text-sm text-gray-600">Tarayıcı bildirimlerini etkinleştir</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Otomatik Giriş</h4>
                    <p className="text-sm text-gray-600">Tarayıcıyı kapattığında otomatik çıkış yap</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 