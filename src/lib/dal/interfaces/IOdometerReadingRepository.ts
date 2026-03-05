import type { OdometerReading } from '@/lib/types';

export interface CreateOdometerReadingInput {
  vehicleId: string;
  userId?: string | null;
  inputMethod: 'scan' | 'manual';
  ocrValue?: number | null;
  confirmedValue: number;
  imageUrl?: string | null;
}

export interface IOdometerReadingRepository {
  create(data: CreateOdometerReadingInput): Promise<OdometerReading>;
  findByVehicleId(vehicleId: string, limit?: number): Promise<OdometerReading[]>;
}
