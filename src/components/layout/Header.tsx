'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HEBREW } from '@/lib/constants/hebrew';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => setIsAdmin(sessionStorage.getItem('admin_auth') === 'true');
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  return (
    <header className="bg-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/vehicles" className="text-lg font-bold">
          {HEBREW.appName}
        </Link>
        <Link
          href="/admin/vehicles"
          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
        >
          {isAdmin ? HEBREW.admin.title : '🔒 ניהול'}
        </Link>
      </div>
    </header>
  );
}
