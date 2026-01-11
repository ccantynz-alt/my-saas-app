/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // IMPORTANT: merge aliases, don't replace them
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // add your aliases here if you need them
    };
    return config;
  },
};

module.exports = nextConfig;
