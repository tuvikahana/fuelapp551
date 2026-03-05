'use client';

import AppShell from '@/components/layout/AppShell';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { HEBREW } from '@/lib/constants/hebrew';
import { useRouter } from 'next/navigation';

export default function NewVehiclePage() {
  const router = useRouter();

  return (
    <AppShell>
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/vehicles')}
          className="text-blue-600 text-sm font-medium"
        >
          ← {HEBREW.common.back}
        </button>
        <h1 className="text-xl font-bold">{HEBREW.admin.createVehicle}</h1>
        <VehicleForm />
      </div>
    </AppShell>
  );
}
