'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleType } from '@/lib/types';

function getAdminPin(): string {
  return sessionStorage.getItem('admin_pin') || '';
}

export default function EditVehicleTypePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/vehicle-types')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((t: VehicleType) => t.id === id);
        setVehicleType(found || null);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleType) return;
    setError('');
    setSuccess(false);
    setSaving(true);

    const res = await fetch(`/api/vehicle-types/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': getAdminPin(),
      },
      body: JSON.stringify({
        fuelTankCapacityLiters: vehicleType.fuelTankCapacityLiters,
        estimatedKmPerLiter: vehicleType.estimatedKmPerLiter,
        fuelBandThreshold75: vehicleType.fuelBandThreshold75,
        fuelBandThreshold50: vehicleType.fuelBandThreshold50,
        fuelBandThreshold25: vehicleType.fuelBandThreshold25,
        fuelBandThreshold10: vehicleType.fuelBandThreshold10,
        actionThresholdPlanRefuel: vehicleType.actionThresholdPlanRefuel,
        actionThresholdRefuelSoon: vehicleType.actionThresholdRefuelSoon,
        actionThresholdRefuelNow: vehicleType.actionThresholdRefuelNow,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(HEBREW.common.error);
    }
  };

  const updateField = (field: string, value: string) => {
    if (!vehicleType) return;
    setVehicleType({ ...vehicleType, [field]: parseFloat(value) || 0 });
  };

  if (loading || !vehicleType) {
    return (
      <AppShell>
        <p className="text-center py-8 text-gray-500">{HEBREW.common.loading}</p>
      </AppShell>
    );
  }

  const fields = [
    { key: 'fuelTankCapacityLiters', label: HEBREW.admin.fuelTankCapacity },
    { key: 'estimatedKmPerLiter', label: HEBREW.admin.kmPerLiter },
    { key: 'fuelBandThreshold75', label: 'סף מלא / כמעט מלא (%)' },
    { key: 'fuelBandThreshold50', label: 'סף כ-3/4 מיכל (%)' },
    { key: 'fuelBandThreshold25', label: 'סף כ-חצי מיכל (%)' },
    { key: 'fuelBandThreshold10', label: 'סף כ-רבע מיכל (%)' },
    { key: 'actionThresholdPlanRefuel', label: 'סף תקין (%)' },
    { key: 'actionThresholdRefuelSoon', label: 'סף להיערך לתדלוק (%)' },
    { key: 'actionThresholdRefuelNow', label: 'סף לתדלק בקרוב (%)' },
  ];

  return (
    <AppShell>
      <div className="space-y-4">
        <button onClick={() => router.push('/admin/vehicle-types')} className="text-blue-600 text-sm font-medium">
          ← {HEBREW.common.back}
        </button>
        <h1 className="text-xl font-bold">{vehicleType.name}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                step="any"
                value={(vehicleType as Record<string, unknown>)[key] as number}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                inputMode="decimal"
              />
            </div>
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">נשמר בהצלחה</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg"
          >
            {saving ? HEBREW.common.loading : HEBREW.admin.save}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
