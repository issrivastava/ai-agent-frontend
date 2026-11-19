import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Accept "https://host", "https://host/" or "https://host/api" without breaking the URL.
    const backend = process.env.BACKEND_URL?.replace(/\/+$/, '').replace(/\/api$/, '');
    if (!backend) return []; // local development keeps calling localhost:5000 directly
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
