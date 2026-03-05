'use client';

import { useState } from 'react';
import { HEBREW } from '@/lib/constants/hebrew';

interface ManualEntryModalProps {
  currentOdometer: number | null;
  onSubmit: (value: number) => Promise<void>;
  onClose: () => void;
}

export default function ManualEntryModal({ currentOdometer, onSubmit, onClose }: ManualEntryModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError(HEBREW.odometer.invalidNumber);
      return;
    }

    if (currentOdometer !== null && numValue < currentOdometer) {
      setError(HEBREW.odometer.lowerThanCurrent);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(numValue);
    } catch {
      setError(HEBREW.common.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-xl rounded-t-xl p-6 animate-slide-up">
        <h2 className="text-lg font-bold mb-4">{HEBREW.odometer.enterValue}</h2>

        {currentOdometer !== null && (
          <p className="text-sm text-gray-500 mb-3">
            {HEBREW.odometer.currentOdometer}: <span className="font-semibold">{currentOdometer.toLocaleString()}</span> {HEBREW.vehicleDetails.km}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {HEBREW.odometer.newReading}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              autoFocus
              inputMode="numeric"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg"
            >
              {loading ? HEBREW.common.loading : HEBREW.odometer.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
            >
              {HEBREW.odometer.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
