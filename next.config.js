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
    ]
  }
};

module.exports = nextConfig; 