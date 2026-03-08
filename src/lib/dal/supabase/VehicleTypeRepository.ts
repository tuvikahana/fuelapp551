import { supabaseAdmin } from '@/lib/supabase-server';
import type { IVehicleTypeRepository, CreateVehicleTypeInput, UpdateVehicleTypeInput } from '../interfaces/IVehicleTypeRepository';
import type { VehicleType } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVehicleType(row: any): VehicleType {
  return {
    id: row.id,
    name: row.name,
    fuelTankCapacityLiters: row.fuel_tank_capacity_liters,
    estimatedKmPerLiter: row.estimated_km_per_liter,
    fuelBandThreshold75: row.fuel_band_threshold_75,
    fuelBandThreshold50: row.fuel_band_threshold_50,
    fuelBandThreshold25: row.fuel_band_threshold_25,
    fuelBandThreshold10: row.fuel_band_threshold_10,
    actionThresholdPlanRefuel: row.action_threshold_plan_refuel,
    actionThresholdRefuelSoon: row.action_threshold_refuel_soon,
    actionThresholdRefuelNow: row.action_threshold_refuel_now,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseVehicleTypeRepository implements IVehicleTypeRepository {
  async findAll(): Promise<VehicleType[]> {
    const { data, error } = await supabaseAdmin
      .from('vehicle_types')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toVehicleType);
  }

  async findById(id: string): Promise<VehicleType | null> {
    const { data, error } = await supabaseAdmin
      .from('vehicle_types')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toVehicleType(data);
  }

  async create(data: CreateVehicleTypeInput): Promise<VehicleType> {
    const { data: row, error } = await supabaseAdmin
      .from('vehicle_types')
      .insert({
        name: data.name,
        fuel_tank_capacity_liters: data.fuelTankCapacityLiters,
        estimated_km_per_liter: data.estimatedKmPerLiter,
        fuel_band_threshold_75: data.fuelBandThreshold75 ?? 75,
        fuel_band_threshold_50: data.fuelBandThreshold50 ?? 50,
        fuel_band_threshold_25: data.fuelBandThreshold25 ?? 25,
        fuel_band_threshold_10: data.fuelBandThreshold10 ?? 10,
        action_threshold_plan_refuel: data.actionThresholdPlanRefuel ?? 35,
        action_threshold_refuel_soon: data.actionThresholdRefuelSoon ?? 20,
        action_threshold_refuel_now: data.actionThresholdRefuelNow ?? 10,
      })
      .select()
      .single();
    if (error) throw error;
    return toVehicleType(row);
  }

  async update(id: string, data: UpdateVehicleTypeInput): Promise<VehicleType> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.fuelTankCapacityLiters !== undefined) payload.fuel_tank_capacity_liters = data.fuelTankCapacityLiters;
    if (data.estimatedKmPerLiter !== undefined) payload.estimated_km_per_liter = data.estimatedKmPerLiter;
    if (data.fuelBandThreshold75 !== undefined) payload.fuel_band_threshold_75 = data.fuelBandThreshold75;
    if (data.fuelBandThreshold50 !== undefined) payload.fuel_band_threshold_50 = data.fuelBandThreshold50;
    if (data.fuelBandThreshold25 !== undefined) payload.fuel_band_threshold_25 = data.fuelBandThreshold25;
    if (data.fuelBandThreshold10 !== undefined) payload.fuel_band_threshold_10 = data.fuelBandThreshold10;
    if (data.actionThresholdPlanRefuel !== undefined) payload.action_threshold_plan_refuel = data.actionThresholdPlanRefuel;
    if (data.actionThresholdRefuelSoon !== undefined) payload.action_threshold_refuel_soon = data.actionThresholdRefuelSoon;
    if (data.actionThresholdRefuelNow !== undefined) payload.action_threshold_refuel_now = data.actionThresholdRefuelNow;

    const { data: row, error } = await supabaseAdmin
      .from('vehicle_types')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toVehicleType(row);
  }
}
