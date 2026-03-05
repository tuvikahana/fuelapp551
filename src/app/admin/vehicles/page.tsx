'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleWithStatus } from '@/lib/types';

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{HEBREW.admin.vehicleManagement}</h1>
          <button
            onClick={() => router.push('/admin/vehicles/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + {HEBREW.admin.createVehicle}
          </button>
        </div>

        <button
          onClick={() => router.push('/admin/vehicle-types')}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300"
        >
          {HEBREW.admin.vehicleTypeSettings}
        </button>

        {vehicles.length === 0 ? (
          <p className="text-center py-8 text-gray-500">{HEBREW.vehicles.noVehicles}</p>
        ) : (
          <div className="space-y-2">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-bold">{vehicle.vehicleNumber}</p>
                  <p className="text-sm text-gray-500">{vehicle.vehicleType.name}</p>
                  {vehicle.nickname && (
                    <p className="text-sm text-gray-400">{vehicle.nickname}</p>
                  )}
                </div>
                <span className="text-gray-400">←</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
