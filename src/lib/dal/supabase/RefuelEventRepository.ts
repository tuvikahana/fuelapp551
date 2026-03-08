import { supabaseAdmin } from '@/lib/supabase';
import type { IRefuelEventRepository, CreateRefuelEventInput } from '../interfaces/IRefuelEventRepository';
import type { RefuelEvent } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRefuelEvent(row: any): RefuelEvent {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    userId: row.user_id ?? null,
    eventType: row.event_type,
    odometerAtRefuel: row.odometer_at_refuel,
    createdAt: row.created_at,
  };
}

export class SupabaseRefuelEventRepository implements IRefuelEventRepository {
  async create(data: CreateRefuelEventInput): Promise<RefuelEvent> {
    const { data: row, error } = await supabaseAdmin
      .from('refuel_events')
      .insert({
        vehicle_id: data.vehicleId,
        user_id: data.userId ?? null,
        odometer_at_refuel: data.odometerAtRefuel,
      })
      .select()
      .single();
    if (error) throw error;
    return toRefuelEvent(row);
  }

  async findByVehicleId(vehicleId: string, limit = 20): Promise<RefuelEvent[]> {
    const { data, error } = await supabaseAdmin
      .from('refuel_events')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(toRefuelEvent);
  }
}
