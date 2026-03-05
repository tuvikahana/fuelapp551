import type { VehicleType } from '@/lib/types';

export interface CreateVehicleTypeInput {
  name: string;
  fuelTankCapacityLiters: number;
  estimatedKmPerLiter: number;
  fuelBandThreshold75?: number;
  fuelBandThreshold50?: number;
  fuelBandThreshold25?: number;
  fuelBandThreshold10?: number;
  actionThresholdPlanRefuel?: number;
  actionThresholdRefuelSoon?: number;
  actionThresholdRefuelNow?: number;
}

export interface UpdateVehicleTypeInput {
  name?: string;
  fuelTankCapacityLiters?: number;
  estimatedKmPerLiter?: number;
  fuelBandThreshold75?: number;
  fuelBandThreshold50?: number;
  fuelBandThreshold25?: number;
  fuelBandThreshold10?: number;
  actionThresholdPlanRefuel?: number;
  actionThresholdRefuelSoon?: number;
  actionThresholdRefuelNow?: number;
}

export interface IVehicleTypeRepository {
  findAll(): Promise<VehicleType[]>;
  findById(id: string): Promise<VehicleType | null>;
  create(data: CreateVehicleTypeInput): Promise<VehicleType>;
  update(id: string, data: UpdateVehicleTypeInput): Promise<VehicleType>;
}
