/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactCompiler: true,

  // Production: forward /api/* to the Express backend so the login cookie
  // stays first-party (works in every browser). Set BACKEND_URL on the host.
  async rewrites() {
    if (!process.env.BACKEND_URL) return [];
    return [
      { source: "/api/:path*", destination: `${process.env.BACKEND_URL}/:path*` },
    ];
  },
};

export default nextConfig;
