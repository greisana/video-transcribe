import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Configura Next.js para exportar estáticamente
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Opción adicional comentada para desactivar optimización de imágenes si es necesario
    // unoptimized: true,
  },
};

export default nextConfig;