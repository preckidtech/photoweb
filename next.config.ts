/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required for high-performance Server Actions in Next.js 16
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.56.1:3000'],
    },
  },
};

export default nextConfig;