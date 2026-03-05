'use client';

import { useState } from 'react';
import { HEBREW } from '@/lib/constants/hebrew';

interface RefuelConfirmModalProps {
  currentOdometer: number | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function RefuelConfirmModal({ currentOdometer, onConfirm, onClose }: RefuelConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (currentOdometer === null) {
      setError(HEBREW.refuel.noOdometerError);
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
    } catch {
      setError(HEBREW.common.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-xl rounded-t-xl p-6">
        <h2 className="text-lg font-bold mb-3">{HEBREW.refuel.confirmTitle}</h2>
        <p className="text-sm text-gray-600 mb-4">{HEBREW.refuel.confirmMessage}</p>

        {currentOdometer !== null && (
          <p className="text-sm text-gray-500 mb-4">
            {HEBREW.odometer.currentOdometer}: <span className="font-semibold">{currentOdometer.toLocaleString()}</span> {HEBREW.vehicleDetails.km}
          </p>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg"
          >
            {loading ? HEBREW.common.loading : HEBREW.refuel.confirm}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
          >
            {HEBREW.refuel.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
