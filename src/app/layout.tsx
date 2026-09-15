import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import NextWaveBackground from '@/components/animations/NextWaveBackground';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

const getBaseUrl = () => {
  const customUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (customUrl && customUrl.startsWith('http')) return customUrl;
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: 'NextWave AI and Data',
  description:
    'Learn. Build. Lead the Future. A premium futuristic AI + Data event platform for NextWave.',
  openGraph: {
    title: 'NextWave AI and Data',
    description:
      'Learn. Build. Lead the Future. A premium futuristic AI + Data event platform for NextWave.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-cyber-bg text-cyber-text antialiased font-sans`}>
        <Providers>
          <NextWaveBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
