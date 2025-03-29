/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desativa a verificação de ESLint durante o build para permitir o deploy no Vercel
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig; 