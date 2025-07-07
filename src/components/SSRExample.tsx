import React from 'react';

interface SSRExampleProps {
  serverTime: string;
  staticData: string;
}

const SSRExample: React.FC<SSRExampleProps> = ({ serverTime, staticData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">SSR/SSG Optimizasyonu</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-800">Server Time (SSR):</span>
          <span className="text-sm text-blue-600">{serverTime}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-800">Static Data (SSG):</span>
          <span className="text-sm text-green-600">{staticData}</span>
        </div>
        <div className="text-xs text-gray-500 mt-4">
          <p><strong>SSR Avantajları:</strong> Dinamik içerik, SEO dostu, hızlı ilk yükleme</p>
          <p><strong>SSG Avantajları:</strong> Maksimum performans, CDN cache, düşük sunucu yükü</p>
        </div>
      </div>
    </div>
  );
};

export default SSRExample; 