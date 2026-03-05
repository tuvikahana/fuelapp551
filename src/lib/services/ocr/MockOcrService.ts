import type { IOcrService, OcrResult } from './IOcrService';

export class MockOcrService implements IOcrService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async extractOdometerValue(imageBase64: string): Promise<OcrResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a random plausible odometer value
    const base = 30000 + Math.floor(Math.random() * 50000);
    const value = Math.round(base / 10) * 10;

    return {
      value,
      confidence: 0.75 + Math.random() * 0.2,
      raw: value.toString(),
    };
  }
}

export const ocrService = new MockOcrService();
