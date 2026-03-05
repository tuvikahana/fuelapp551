'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleWithType } from '@/lib/types';

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<VehicleWithType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      });
  }, [id]);

  if (loading || !vehicle) {
    return (
      <AppShell>
        <p className="text-center py-8 text-gray-500">{HEBREW.common.loading}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/vehicles')}
          className="text-blue-600 text-sm font-medium"
        >
          ← {HEBREW.common.back}
        </button>
        <h1 className="text-xl font-bold">{HEBREW.admin.editVehicle} — {vehicle.vehicleNumber}</h1>
        <VehicleForm vehicle={vehicle} isEdit />
      </div>
    </AppShell>
  );
}
