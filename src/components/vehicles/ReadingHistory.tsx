'use client';

import { HEBREW } from '@/lib/constants/hebrew';
import type { OdometerReading, RefuelEvent } from '@/lib/types';

interface HistoryItem {
  type: 'odometer' | 'refuel';
  date: Date;
  data: OdometerReading | RefuelEvent;
}

interface ReadingHistoryProps {
  readings: OdometerReading[];
  refuelEvents: RefuelEvent[];
}

export default function ReadingHistory({ readings, refuelEvents }: ReadingHistoryProps) {
  const items: HistoryItem[] = [
    ...readings.map((r) => ({ type: 'odometer' as const, date: new Date(r.createdAt), data: r })),
    ...refuelEvents.map((r) => ({ type: 'refuel' as const, date: new Date(r.createdAt), data: r })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (items.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-4">{HEBREW.vehicleDetails.noOdometer}</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
          <div>
            {item.type === 'odometer' ? (
              <>
                <span className="font-medium">
                  {(item.data as OdometerReading).confirmedValue.toLocaleString()} {HEBREW.vehicleDetails.km}
                </span>
                <span className="text-gray-400 text-xs mr-2">
                  ({(item.data as OdometerReading).inputMethod === 'scan' ? HEBREW.vehicleDetails.scanOdometer : HEBREW.vehicleDetails.manualEntry})
                </span>
              </>
            ) : (
              <span className="font-medium text-green-700">
                {HEBREW.vehicleDetails.markFullRefuel} — {(item.data as RefuelEvent).odometerAtRefuel.toLocaleString()} {HEBREW.vehicleDetails.km}
              </span>
            )}
          </div>
          <span className="text-gray-400 text-xs">
            {item.date.toLocaleDateString('he-IL')} {item.date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  );
}
