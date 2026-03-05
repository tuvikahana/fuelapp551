import type { Vehicle, VehicleWithType } from '@/lib/types';

export interface CreateVehicleInput {
  vehicleNumber: string;
  vehicleTypeId: string;
  nickname?: string;
  notes?: string;
  lastFullRefuelOdometer?: number;
  latestConfirmedOdometer?: number;
}

export interface UpdateVehicleInput {
  vehicleNumber?: string;
  vehicleTypeId?: string;
  nickname?: string | null;
  notes?: string | null;
  lastFullRefuelOdometer?: number | null;
  latestConfirmedOdometer?: number | null;
}

export interface IVehicleRepository {
  findAll(): Promise<VehicleWithType[]>;
  findById(id: string): Promise<VehicleWithType | null>;
  search(query: string): Promise<VehicleWithType[]>;
  create(data: CreateVehicleInput): Promise<Vehicle>;
  update(id: string, data: UpdateVehicleInput): Promise<Vehicle>;
  updateOdometer(id: string, confirmedValue: number): Promise<Vehicle>;
  markFullRefuel(id: string, odometerValue: number): Promise<Vehicle>;
}
