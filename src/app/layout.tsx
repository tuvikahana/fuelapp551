import type { Metadata, Viewport } from 'next';
import PWARegister from '@/components/PWARegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'FuelApp - מעקב תדלוק',
  description: 'מעקב מוכנות תדלוק משוערת לרכבים',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FuelApp',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e3a5f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
