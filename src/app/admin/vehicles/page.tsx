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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const pin = sessionStorage.getItem('admin_pin') ?? '';
    await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin },
    });
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setDeletingId(null);
    setConfirmId(null);
  };

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
                className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                >
                  <p className="font-bold">{vehicle.vehicleNumber}</p>
                  <p className="text-sm text-gray-500">{vehicle.vehicleType.name}</p>
                  {vehicle.nickname && (
                    <p className="text-sm text-gray-400">{vehicle.nickname}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {confirmId === vehicle.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        disabled={deletingId === vehicle.id}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {deletingId === vehicle.id ? '...' : 'מחק'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-gray-500 text-sm px-3 py-1.5 rounded-lg border border-gray-300"
                      >
                        ביטול
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                        className="text-blue-600 text-sm px-3 py-1.5 rounded-lg border border-blue-200"
                      >
                        עריכה
                      </button>
                      <button
                        onClick={() => setConfirmId(vehicle.id)}
                        className="text-red-500 text-sm px-3 py-1.5 rounded-lg border border-red-200"
                      >
                        מחיקה
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
