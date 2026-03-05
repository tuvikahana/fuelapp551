'use client';

import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { HEBREW } from '@/lib/constants/hebrew';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  if (hasError) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-500 mb-2">לא ניתן לגשת למצלמה</p>
        <p className="text-sm text-gray-400">אנא אפשר גישה למצלמה או השתמש בהזנה ידנית</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }}
          onUserMediaError={() => setHasError(true)}
          className="w-full"
        />
        {/* Overlay guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-white/50 rounded-lg w-3/4 h-16" />
        </div>
      </div>
      <button
        onClick={capture}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg"
      >
        {HEBREW.scan.capture}
      </button>
    </div>
  );
}
