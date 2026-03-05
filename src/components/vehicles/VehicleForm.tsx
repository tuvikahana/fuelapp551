'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleType, VehicleWithType } from '@/lib/types';

interface VehicleFormProps {
  vehicle?: VehicleWithType;
  isEdit?: boolean;
}

function getAdminPin(): string {
  return sessionStorage.getItem('admin_pin') || '';
}

export default function VehicleForm({ vehicle, isEdit }: VehicleFormProps) {
  const router = useRouter();
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [form, setForm] = useState({
    vehicleNumber: vehicle?.vehicleNumber || '',
    vehicleTypeId: vehicle?.vehicleTypeId || '',
    nickname: vehicle?.nickname || '',
    notes: vehicle?.notes || '',
    latestConfirmedOdometer: vehicle?.latestConfirmedOdometer?.toString() || '',
    lastFullRefuelOdometer: vehicle?.lastFullRefuelOdometer?.toString() || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/vehicle-types')
      .then((res) => res.json())
      .then((data) => {
        setVehicleTypes(data);
        if (!form.vehicleTypeId && data.length > 0) {
          setForm((prev) => ({ ...prev, vehicleTypeId: data[0].id }));
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const body: Record<string, unknown> = {
      vehicleNumber: form.vehicleNumber,
      vehicleTypeId: form.vehicleTypeId,
      nickname: form.nickname || undefined,
      notes: form.notes || undefined,
    };

    if (!isEdit) {
      if (form.latestConfirmedOdometer) body.latestConfirmedOdometer = parseFloat(form.latestConfirmedOdometer);
      if (form.lastFullRefuelOdometer) body.lastFullRefuelOdometer = parseFloat(form.lastFullRefuelOdometer);
    }

    const url = isEdit ? `/api/vehicles/${vehicle?.id}` : '/api/vehicles';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': getAdminPin(),
      },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin/vehicles');
      router.refresh();
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : HEBREW.common.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{HEBREW.vehicles.vehicleNumber}</label>
        <input
          type="text"
          value={form.vehicleNumber}
          onChange={(e) => setForm((prev) => ({ ...prev, vehicleNumber: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{HEBREW.vehicles.vehicleType}</label>
        <select
          value={form.vehicleTypeId}
          onChange={(e) => setForm((prev) => ({ ...prev, vehicleTypeId: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
          required
        >
          {vehicleTypes.map((vt) => (
            <option key={vt.id} value={vt.id}>{vt.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{HEBREW.vehicles.nickname}</label>
        <input
          type="text"
          value={form.nickname}
          onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{HEBREW.vehicles.notes}</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {!isEdit && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{HEBREW.vehicles.lastOdometer} (אופציונלי)</label>
            <input
              type="number"
              value={form.latestConfirmedOdometer}
              onChange={(e) => setForm((prev) => ({ ...prev, latestConfirmedOdometer: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ק״מ בתדלוק מלא אחרון (אופציונלי)</label>
            <input
              type="number"
              value={form.lastFullRefuelOdometer}
              onChange={(e) => setForm((prev) => ({ ...prev, lastFullRefuelOdometer: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
            />
          </div>
        </>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg"
        >
          {loading ? HEBREW.common.loading : HEBREW.admin.save}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
        >
          {HEBREW.odometer.cancel}
        </button>
      </div>
    </form>
  );
}
