'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleType } from '@/lib/types';

export default function VehicleTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicle-types')
      .then((res) => res.json())
      .then((data) => {
        setTypes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        <h1 className="text-xl font-bold">{HEBREW.admin.vehicleTypeSettings}</h1>

        <div className="space-y-2">
          {types.map((type) => (
            <div
              key={type.id}
              onClick={() => router.push(`/admin/vehicle-types/${type.id}/edit`)}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50"
            >
              <p className="font-bold text-lg">{type.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                <p>{HEBREW.admin.fuelTankCapacity}: {type.fuelTankCapacityLiters} ליטר</p>
                <p>{HEBREW.admin.kmPerLiter}: {type.estimatedKmPerLiter}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
