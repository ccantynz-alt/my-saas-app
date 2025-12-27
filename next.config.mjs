/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // IMPORTANT:
  // Do NOT set `output: "export"`.
  // Static export disables /api routes and causes /api/* to return 404 on Vercel.
};

module.exports = nextConfig;
