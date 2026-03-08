/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // This allows all Supabase storage images
      },
    ],
  },
  // Since we are using face-api.js, we must disable server-side minification 
  // of the models to prevent corruption during build
  serverExternalPackages: ['face-api.js'], 
};

export default nextConfig;