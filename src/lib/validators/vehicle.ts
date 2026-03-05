import { z } from 'zod';

export const createVehicleSchema = z.object({
  vehicleNumber: z.string().min(1, 'מספר רכב נדרש'),
  vehicleTypeId: z.string().min(1, 'סוג רכב נדרש'),
  nickname: z.string().optional(),
  notes: z.string().optional(),
  lastFullRefuelOdometer: z.number().optional(),
  latestConfirmedOdometer: z.number().optional(),
});

export const updateVehicleSchema = z.object({
  vehicleNumber: z.string().min(1).optional(),
  vehicleTypeId: z.string().min(1).optional(),
  nickname: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateVehicleTypeSchema = z.object({
  name: z.string().min(1).optional(),
  fuelTankCapacityLiters: z.number().positive().optional(),
  estimatedKmPerLiter: z.number().positive().optional(),
  fuelBandThreshold75: z.number().min(0).max(100).optional(),
  fuelBandThreshold50: z.number().min(0).max(100).optional(),
  fuelBandThreshold25: z.number().min(0).max(100).optional(),
  fuelBandThreshold10: z.number().min(0).max(100).optional(),
  actionThresholdPlanRefuel: z.number().min(0).max(100).optional(),
  actionThresholdRefuelSoon: z.number().min(0).max(100).optional(),
  actionThresholdRefuelNow: z.number().min(0).max(100).optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type UpdateVehicleTypeInput = z.infer<typeof updateVehicleTypeSchema>;
