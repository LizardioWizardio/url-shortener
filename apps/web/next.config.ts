import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Standalone для Docker
  output: 'standalone',
  turbopack: {
    // Указываем корень монорепы явно
    root: path.resolve(__dirname, '../../')
  },
  
  // API proxy для избежания CORS (опционально)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

export default nextConfig;