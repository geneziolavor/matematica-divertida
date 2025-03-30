/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desativa a verificação de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desativa a verificação de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  // Configuração de imagens para permitir domínios externos
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'placekitten.com' },
      { hostname: 'picsum.photos' }
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  // Configurações de performance
  experimental: {
    // Corrigido para versão atual do Next.js
    serverExternalPackages: ['mongoose'],
    // Otimiza módulos para reduzir o tamanho do bundle
    optimizePackageImports: ['react-icons', 'framer-motion']
  },
  // Aumentar o tamanho do payload no API Route
  api: {
    responseLimit: '8mb',
  },
  // Configurações de Webpack para melhorar o build (opcional)
  webpack: (config, { isServer }) => {
    // Otimiza carregamento de JSON para reduzir tamanho de bundle
    config.module.rules.push({
      test: /\.json$/,
      use: 'json-loader',
      type: 'javascript/auto',
    });
    
    return config;
  },
};

module.exports = nextConfig; 