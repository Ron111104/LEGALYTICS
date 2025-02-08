/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Setting up headers to allow CORS for all API routes
  async headers() {
    return [
      {
        source: '/api/:path*', // Apply to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Replace '*' with your frontend domain for better security
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
