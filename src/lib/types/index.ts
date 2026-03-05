import type { Vehicle, VehicleType, OdometerReading, RefuelEvent, User } from '@prisma/client';

export type { Vehicle, VehicleType, OdometerReading, RefuelEvent, User };

export type VehicleWithType = Vehicle & {
  vehicleType: VehicleType;
};

export type FuelBand =
  | 'מלא / כמעט מלא'
  | 'כ־3/4 מיכל'
  | 'כ־חצי מיכל'
  | 'כ־רבע מיכל'
  | 'רזרבה';

export type ActionStatus =
  | 'תקין'
  | 'להיערך לתדלוק'
  | 'לתדלק בקרוב'
  | 'לתדלק עכשיו';

export interface FuelStatus {
  distanceSinceRefuel: number;
  estimatedFullRangeKm: number;
  estimatedRemainingRange: number;
  estimatedRemainingPercentage: number;
  fuelBand: FuelBand;
  actionStatus: ActionStatus;
  hasMissingBaseline: boolean;
}

export interface VehicleWithStatus extends VehicleWithType {
  fuelStatus: FuelStatus;
}

export interface VehicleTypeParams {
  fuelTankCapacityLiters: number;
  estimatedKmPerLiter: number;
  fuelBandThreshold75: number;
  fuelBandThreshold50: number;
  fuelBandThreshold25: number;
  fuelBandThreshold10: number;
  actionThresholdPlanRefuel: number;
  actionThresholdRefuelSoon: number;
  actionThresholdRefuelNow: number;
}
