'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import CameraCapture from '@/components/scan/CameraCapture';
import OcrResultEditor from '@/components/scan/OcrResultEditor';
import { ocrService } from '@/lib/services/ocr/MockOcrService';
import { HEBREW } from '@/lib/constants/hebrew';
import type { VehicleWithStatus } from '@/lib/types';

type ScanState = 'camera' | 'processing' | 'result';

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<VehicleWithStatus | null>(null);
  const [scanState, setScanState] = useState<ScanState>('camera');
  const [ocrValue, setOcrValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    const res = await fetch(`/api/vehicles/${id}`);
    if (res.ok) setVehicle(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchVehicle(); }, [fetchVehicle]);

  const handleCapture = async (imageBase64: string) => {
    setScanState('processing');
    const result = await ocrService.extractOdometerValue(imageBase64);
    setOcrValue(result.value);
    setScanState('result');
  };

  const handleConfirm = async (confirmedValue: number) => {
    const res = await fetch(`/api/vehicles/${id}/odometer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmedValue, inputMethod: 'scan', ocrValue }),
    });
    if (res.ok) router.push(`/vehicles/${id}`);
  };

  if (loading || !vehicle) {
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
          <button onClick={() => router.push(`/vehicles/${id}`)} className="text-blue-600 text-sm font-medium">
            ← {HEBREW.common.back}
          </button>
          <h1 className="text-lg font-bold">{HEBREW.scan.title}</h1>
          <div className="w-12" />
        </div>

        <p className="text-sm text-gray-500 text-center">
          {vehicle.vehicleNumber} — {vehicle.vehicleType.name}
        </p>

        {scanState === 'camera' && <CameraCapture onCapture={handleCapture} />}

        {scanState === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">{HEBREW.scan.processing}</p>
          </div>
        )}

        {scanState === 'result' && (
          <OcrResultEditor
            suggestedValue={ocrValue}
            currentOdometer={vehicle.latestConfirmedOdometer}
            onConfirm={handleConfirm}
            onRetry={() => { setOcrValue(null); setScanState('camera'); }}
            onSwitchToManual={() => router.push(`/vehicles/${id}`)}
          />
        )}
      </div>
    </AppShell>
  );
}
