/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🚫 DO NOT EXPORT STATIC
  output: undefined,

  // ✅ Force server runtime
  experimental: {
    appDir: true
  }
};

export default nextConfig;
