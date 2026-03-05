'use client';

import { useState } from 'react';
import { HEBREW } from '@/lib/constants/hebrew';

interface OcrResultEditorProps {
  suggestedValue: number | null;
  currentOdometer: number | null;
  onConfirm: (value: number) => void;
  onRetry: () => void;
  onSwitchToManual: () => void;
}

export default function OcrResultEditor({
  suggestedValue,
  currentOdometer,
  onConfirm,
  onRetry,
  onSwitchToManual,
}: OcrResultEditorProps) {
  const [value, setValue] = useState(suggestedValue?.toString() || '');
  const [error, setError] = useState('');

  const handleConfirm = () => {
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

    onConfirm(numValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {HEBREW.scan.suggestedValue}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl text-center font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          inputMode="numeric"
        />
        <p className="text-xs text-gray-400 mt-1 text-center">{HEBREW.scan.editAndConfirm}</p>
      </div>

      {currentOdometer !== null && (
        <p className="text-sm text-gray-500 text-center">
          {HEBREW.odometer.currentOdometer}: {currentOdometer.toLocaleString()} {HEBREW.vehicleDetails.km}
        </p>
      )}

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <button
        onClick={handleConfirm}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg"
      >
        {HEBREW.odometer.confirm}
      </button>

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg"
        >
          {HEBREW.scan.retry}
        </button>
        <button
          onClick={onSwitchToManual}
          className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg"
        >
          {HEBREW.scan.switchToManual}
        </button>
      </div>
    </div>
  );
}
