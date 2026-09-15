/** @type {import('next').NextConfig} */

// Ultimate fix for Vercel empty string env bugs:
['NEXTAUTH_URL', 'DATABASE_URL', 'NEXT_PUBLIC_APP_URL', 'VERCEL_URL'].forEach(key => {
  if (process.env[key] !== undefined && process.env[key].trim() === '') {
    delete process.env[key]; // Force fallback behaviors to kick in instead of crashing
  }
});

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
