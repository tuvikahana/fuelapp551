export interface OcrResult {
  value: number | null;
  confidence: number;
  raw: string;
}

export interface IOcrService {
  extractOdometerValue(imageBase64: string): Promise<OcrResult>;
}
