import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const backend = process.env.BACKEND_URL?.replace(/\/+$/, '').replace(/\/api$/, '');
    if (!backend) return [];
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
