/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint is not configured yet; don't block builds on it (types are still checked).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
