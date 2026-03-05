'use client';

import clsx from 'clsx';
import type { ActionStatus, FuelBand } from '@/lib/types';

const actionStatusColors: Record<ActionStatus, string> = {
  'תקין': 'bg-green-100 text-green-800 border-green-200',
  'להיערך לתדלוק': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'לתדלק בקרוב': 'bg-orange-100 text-orange-800 border-orange-200',
  'לתדלק עכשיו': 'bg-red-100 text-red-800 border-red-200',
};

const fuelBandColors: Record<FuelBand, string> = {
  'מלא / כמעט מלא': 'bg-green-100 text-green-800 border-green-200',
  'כ־3/4 מיכל': 'bg-blue-100 text-blue-800 border-blue-200',
  'כ־חצי מיכל': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'כ־רבע מיכל': 'bg-orange-100 text-orange-800 border-orange-200',
  'רזרבה': 'bg-red-100 text-red-800 border-red-200',
};

export function ActionStatusBadge({ status }: { status: ActionStatus }) {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-1 rounded-full text-xs font-semibold border',
        actionStatusColors[status]
      )}
    >
      {status}
    </span>
  );
}

export function FuelBandBadge({ band }: { band: FuelBand }) {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-1 rounded-full text-xs font-semibold border',
        fuelBandColors[band]
      )}
    >
      {band}
    </span>
  );
}
