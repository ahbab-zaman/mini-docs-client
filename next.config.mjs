/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true, // ✅ This is important!
  },
};

export default nextConfig;
