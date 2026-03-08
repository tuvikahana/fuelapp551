import { supabaseAdmin } from '@/lib/supabase-server';
import type { IVehicleRepository, CreateVehicleInput, UpdateVehicleInput } from '../interfaces/IVehicleRepository';
import type { Vehicle, VehicleType, VehicleWithType } from '@/lib/types';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVehicle(row: any): Vehicle {
  return {
    id: row.id,
    vehicleNumber: row.vehicle_number,
    vehicleTypeId: row.vehicle_type_id,
    nickname: row.nickname ?? null,
    notes: row.notes ?? null,
    lastFullRefuelOdometer: row.last_full_refuel_odometer ?? null,
    latestConfirmedOdometer: row.latest_confirmed_odometer ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVehicleWithType(row: any): VehicleWithType {
  return {
    ...toVehicle(row),
    vehicleType: toVehicleType(row.vehicle_types),
  };
}

export class SupabaseVehicleRepository implements IVehicleRepository {
  async findAll(): Promise<VehicleWithType[]> {
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .select('*, vehicle_types(*)')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toVehicleWithType);
  }

  async findById(id: string): Promise<VehicleWithType | null> {
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .select('*, vehicle_types(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return toVehicleWithType(data);
  }

  async search(query: string): Promise<VehicleWithType[]> {
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .select('*, vehicle_types(*)')
      .or(`vehicle_number.ilike.%${query}%,nickname.ilike.%${query}%`)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toVehicleWithType);
  }

  async create(data: CreateVehicleInput): Promise<Vehicle> {
    const { data: row, error } = await supabaseAdmin
      .from('vehicles')
      .insert({
        vehicle_number: data.vehicleNumber,
        vehicle_type_id: data.vehicleTypeId,
        nickname: data.nickname ?? null,
        notes: data.notes ?? null,
        last_full_refuel_odometer: data.lastFullRefuelOdometer ?? null,
        latest_confirmed_odometer: data.latestConfirmedOdometer ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return toVehicle(row);
  }

  async update(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    const payload: Record<string, unknown> = {};
    if (data.vehicleNumber !== undefined) payload.vehicle_number = data.vehicleNumber;
    if (data.vehicleTypeId !== undefined) payload.vehicle_type_id = data.vehicleTypeId;
    if ('nickname' in data) payload.nickname = data.nickname;
    if ('notes' in data) payload.notes = data.notes;
    if ('lastFullRefuelOdometer' in data) payload.last_full_refuel_odometer = data.lastFullRefuelOdometer;
    if ('latestConfirmedOdometer' in data) payload.latest_confirmed_odometer = data.latestConfirmedOdometer;

    const { data: row, error } = await supabaseAdmin
      .from('vehicles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toVehicle(row);
  }

  async updateOdometer(id: string, confirmedValue: number): Promise<Vehicle> {
    const { data: row, error } = await supabaseAdmin
      .from('vehicles')
      .update({ latest_confirmed_odometer: confirmedValue })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toVehicle(row);
  }

  async markFullRefuel(id: string, odometerValue: number): Promise<Vehicle> {
    const { data: row, error } = await supabaseAdmin
      .from('vehicles')
      .update({ last_full_refuel_odometer: odometerValue })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toVehicle(row);
  }
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('vehicles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
