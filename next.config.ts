import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR/SSG Optimizasyonları
  experimental: {
    // Server Components optimizasyonu
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Compiler optimizasyonları
  compiler: {
    // Gereksiz console.log'ları production'da kaldır
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimizasyonu
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Image optimizasyonu
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Performance optimizasyonları
  poweredByHeader: false,
  compress: true,
  
  // Bundle analizi (opsiyonel)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;
