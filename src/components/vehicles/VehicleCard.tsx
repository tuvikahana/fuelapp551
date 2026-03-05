'use client';

import Link from 'next/link';
import { ActionStatusBadge, FuelBandBadge } from '@/components/ui/StatusBadge';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleWithStatus } from '@/lib/types';

function formatTimeAgo(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  return `לפני ${diffDays} ימים`;
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleWithStatus }) {
  const { fuelStatus } = vehicle;

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{vehicle.vehicleNumber}</h3>
            <p className="text-sm text-gray-500">{vehicle.vehicleType.name}</p>
            {vehicle.nickname && (
              <p className="text-sm text-gray-400">{vehicle.nickname}</p>
            )}
          </div>
          <ActionStatusBadge status={fuelStatus.actionStatus} />
        </div>

        {fuelStatus.hasMissingBaseline ? (
          <p className="text-sm text-amber-600 mt-2">
            {vehicle.latestConfirmedOdometer === null
              ? HEBREW.vehicleDetails.noOdometer
              : HEBREW.vehicleDetails.noBaseline}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <span className="text-gray-500">{HEBREW.vehicles.lastOdometer}</span>
              <p className="font-semibold">{vehicle.latestConfirmedOdometer?.toLocaleString()} {HEBREW.vehicleDetails.km}</p>
            </div>
            <div>
              <span className="text-gray-500">{HEBREW.vehicles.distanceSinceRefuel}</span>
              <p className="font-semibold">{fuelStatus.distanceSinceRefuel.toLocaleString()} {HEBREW.vehicleDetails.km}</p>
            </div>
            <div>
              <span className="text-gray-500">{HEBREW.vehicles.estimatedFuelStatus}</span>
              <div className="mt-0.5">
                <FuelBandBadge band={fuelStatus.fuelBand} />
              </div>
            </div>
            <div>
              <span className="text-gray-500">{HEBREW.vehicles.estimatedRange}</span>
              <p className="font-semibold">{fuelStatus.estimatedRemainingRange.toLocaleString()} {HEBREW.vehicleDetails.km}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          {HEBREW.vehicles.lastUpdated}: {formatTimeAgo(vehicle.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
