import type { IOcrService, OcrResult } from './IOcrService';

export class RealOcrService implements IOcrService {
  async extractOdometerValue(imageBase64: string): Promise<OcrResult> {
    const res = await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!res.ok) {
      return { value: null, confidence: 0, raw: 'error' };
    }

    const data = await res.json();
    return {
      value: data.value ?? null,
      confidence: data.value != null ? 0.9 : 0,
      raw: data.raw ?? '',
    };
  }
}

export const ocrService = new RealOcrService();
