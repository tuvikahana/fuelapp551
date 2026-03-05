'use client';

import { useEffect, useState } from 'react';
import AdminPinModal from '@/components/admin/AdminPinModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth') === 'true';
    setAuthorized(auth);
  }, []);

  if (authorized === null) return null;

  if (!authorized) {
    return <AdminPinModal onSuccess={() => setAuthorized(true)} />;
  }

  return <>{children}</>;
}
