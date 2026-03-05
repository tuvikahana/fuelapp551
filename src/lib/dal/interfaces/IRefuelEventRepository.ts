import type { RefuelEvent } from '@/lib/types';

export interface CreateRefuelEventInput {
  vehicleId: string;
  userId?: string | null;
  odometerAtRefuel: number;
}

export interface IRefuelEventRepository {
  create(data: CreateRefuelEventInput): Promise<RefuelEvent>;
  findByVehicleId(vehicleId: string, limit?: number): Promise<RefuelEvent[]>;
}
