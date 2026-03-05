import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FuelApp - מערכת מעקב תדלוק',
    short_name: 'FuelApp',
    description: 'מעקב מוכנות תדלוק משוערת לרכבים',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#1e3a5f',
    dir: 'rtl',
    lang: 'he',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
