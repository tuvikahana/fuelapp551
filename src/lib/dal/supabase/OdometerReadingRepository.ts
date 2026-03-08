import { supabaseAdmin } from '@/lib/supabase';
import type { IOdometerReadingRepository, CreateOdometerReadingInput } from '../interfaces/IOdometerReadingRepository';
import type { OdometerReading } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toOdometerReading(row: any): OdometerReading {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    userId: row.user_id ?? null,
    inputMethod: row.input_method,
    ocrValue: row.ocr_value ?? null,
    confirmedValue: row.confirmed_value,
    imageUrl: row.image_url ?? null,
    createdAt: row.created_at,
  };
}

export class SupabaseOdometerReadingRepository implements IOdometerReadingRepository {
  async create(data: CreateOdometerReadingInput): Promise<OdometerReading> {
    const { data: row, error } = await supabaseAdmin
      .from('odometer_readings')
      .insert({
        vehicle_id: data.vehicleId,
        user_id: data.userId ?? null,
        input_method: data.inputMethod,
        ocr_value: data.ocrValue ?? null,
        confirmed_value: data.confirmedValue,
        image_url: data.imageUrl ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return toOdometerReading(row);
  }

  async findByVehicleId(vehicleId: string, limit = 20): Promise<OdometerReading[]> {
    const { data, error } = await supabaseAdmin
      .from('odometer_readings')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(toOdometerReading);
  }
}
