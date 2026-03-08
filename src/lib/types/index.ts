// Core domain types (independent of any ORM)

export interface User {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleType {
  id: string;
  name: string;
  fuelTankCapacityLiters: number;
  estimatedKmPerLiter: number;
  fuelBandThreshold75: number;
  fuelBandThreshold50: number;
  fuelBandThreshold25: number;
  fuelBandThreshold10: number;
  actionThresholdPlanRefuel: number;
  actionThresholdRefuelSoon: number;
  actionThresholdRefuelNow: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleTypeId: string;
  nickname: string | null;
  notes: string | null;
  lastFullRefuelOdometer: number | null;
  latestConfirmedOdometer: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OdometerReading {
  id: string;
  vehicleId: string;
  userId: string | null;
  inputMethod: string;
  ocrValue: number | null;
  confirmedValue: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface RefuelEvent {
  id: string;
  vehicleId: string;
  userId: string | null;
  eventType: string;
  odometerAtRefuel: number;
  createdAt: string;
}

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
