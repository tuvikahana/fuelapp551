'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { ActionStatusBadge, FuelBandBadge } from '@/components/ui/StatusBadge';
import ManualEntryModal from '@/components/vehicles/ManualEntryModal';
import RefuelConfirmModal from '@/components/vehicles/RefuelConfirmModal';
import ReadingHistory from '@/components/vehicles/ReadingHistory';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleWithStatus, OdometerReading, RefuelEvent } from '@/lib/types';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<VehicleWithStatus | null>(null);
  const [readings, setReadings] = useState<OdometerReading[]>([]);
  const [refuelEvents, setRefuelEvents] = useState<RefuelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showRefuelConfirm, setShowRefuelConfirm] = useState(false);

  const fetchVehicle = useCallback(async () => {
    const res = await fetch(`/api/vehicles/${id}`);
    if (res.ok) setVehicle(await res.json());
  }, [id]);

  const fetchHistory = useCallback(async () => {
    const res = await fetch(`/api/vehicles/${id}/readings`);
    if (res.ok) {
      const data = await res.json();
      setReadings(data.readings);
      setRefuelEvents(data.refuelEvents);
    }
  }, [id]);

  useEffect(() => {
    Promise.all([fetchVehicle(), fetchHistory()]).then(() => setLoading(false));
  }, [fetchVehicle, fetchHistory]);

  const handleOdometerSubmit = async (value: number) => {
    const res = await fetch(`/api/vehicles/${id}/odometer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmedValue: value, inputMethod: 'manual' }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }

    setVehicle(await res.json());
    setShowManualEntry(false);
    fetchHistory();
  };

  const handleRefuel = async () => {
    const res = await fetch(`/api/vehicles/${id}/refuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }

    setVehicle(await res.json());
    setShowRefuelConfirm(false);
    fetchHistory();
  };

  if (loading || !vehicle) {
    return (
      <AppShell>
        <p className="text-center py-8 text-gray-500">{HEBREW.common.loading}</p>
      </AppShell>
    );
  }

  const { fuelStatus } = vehicle;

  return (
    <AppShell>
      <div className="space-y-4">
        <button onClick={() => router.push('/vehicles')} className="text-blue-600 text-sm font-medium">
          ← {HEBREW.common.back}
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">{vehicle.vehicleNumber}</h1>
              <p className="text-gray-500">{vehicle.vehicleType.name}</p>
              {vehicle.nickname && <p className="text-gray-400 text-sm">{vehicle.nickname}</p>}
            </div>
            <ActionStatusBadge status={fuelStatus.actionStatus} />
          </div>

          {fuelStatus.hasMissingBaseline ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <p className="text-amber-700 text-sm">
                {vehicle.latestConfirmedOdometer === null
                  ? HEBREW.vehicleDetails.noOdometer
                  : HEBREW.vehicleDetails.noBaseline}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{HEBREW.vehicles.lastOdometer}</p>
                <p className="text-lg font-bold">{vehicle.latestConfirmedOdometer?.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{HEBREW.vehicleDetails.km}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{HEBREW.vehicles.distanceSinceRefuel}</p>
                <p className="text-lg font-bold">{fuelStatus.distanceSinceRefuel.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{HEBREW.vehicleDetails.km}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{HEBREW.vehicles.estimatedFuelStatus}</p>
                <FuelBandBadge band={fuelStatus.fuelBand} />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{HEBREW.vehicleDetails.estimatedRemaining}</p>
                <p className="text-lg font-bold">{fuelStatus.estimatedRemainingRange.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{HEBREW.vehicleDetails.km}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3 text-center">{HEBREW.vehicleDetails.basedOn}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => router.push(`/vehicles/${id}/scan`)}
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
          >
            {HEBREW.vehicleDetails.scanOdometer}
          </button>
          <button
            onClick={() => setShowManualEntry(true)}
            className="py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm"
          >
            {HEBREW.vehicleDetails.manualEntry}
          </button>
          <button
            onClick={() => setShowRefuelConfirm(true)}
            className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm"
          >
            {HEBREW.vehicleDetails.markFullRefuel}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">{HEBREW.vehicleDetails.recentHistory}</h2>
          <ReadingHistory readings={readings} refuelEvents={refuelEvents} />
        </div>
      </div>

      {showManualEntry && (
        <ManualEntryModal
          currentOdometer={vehicle.latestConfirmedOdometer}
          onSubmit={handleOdometerSubmit}
          onClose={() => setShowManualEntry(false)}
        />
      )}

      {showRefuelConfirm && (
        <RefuelConfirmModal
          currentOdometer={vehicle.latestConfirmedOdometer}
          onConfirm={handleRefuel}
          onClose={() => setShowRefuelConfirm(false)}
        />
      )}
    </AppShell>
  );
}
