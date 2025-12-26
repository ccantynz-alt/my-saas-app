/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ CRITICAL: do NOT static export
  // (If output is "export", Vercel will try to prerender /api/* and fail.)
  output: undefined
};

module.exports = nextConfig;
