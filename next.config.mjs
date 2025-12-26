/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ ensure server build, not static export
  output: undefined
};

export default nextConfig;
