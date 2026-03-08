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
        style={{ maxHeight: '60vh' }}
      />
      {/* Guide rectangle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="border-2 border-white/70 rounded-lg w-3/4 h-16" />
      </div>
      {/* Capture button always visible at bottom of camera */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={capture}
          className="bg-white text-blue-700 font-bold px-10 py-3 rounded-full shadow-lg text-lg active:scale-95 transition-transform"
        >
          {HEBREW.scan.capture}
        </button>
      </div>
    </div>
  );
}
