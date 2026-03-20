import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // CRITICAL: Allow cross-origin requests from preview environment
  // IMPORTANT: The hostname must match EXACTLY what appears in the warning
  // Check dev.log for the exact hostname format
  allowedDevOrigins: [
    // Exact hostname from cross-origin warning (copy exactly from error message)
    'preview-chat-35bdc524-73ef-485e-a073-8ec7014c92b5.space.z.ai',
    // Also try with leading dot for wildcard subdomain matching
    '.space.z.ai',
    'space.z.ai',
    // Local development
    'localhost',
  ],
  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
