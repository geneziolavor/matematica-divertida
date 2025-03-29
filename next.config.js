/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desativa a verificação de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desativa a verificação de TypeScript durante o build
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig; 