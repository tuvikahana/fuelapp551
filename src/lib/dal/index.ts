import { SupabaseUserRepository } from './supabase/UserRepository';
import { SupabaseVehicleRepository } from './supabase/VehicleRepository';
import { SupabaseVehicleTypeRepository } from './supabase/VehicleTypeRepository';
import { SupabaseOdometerReadingRepository } from './supabase/OdometerReadingRepository';
import { SupabaseRefuelEventRepository } from './supabase/RefuelEventRepository';

// Single point of change when swapping persistence layer
export const userRepository = new SupabaseUserRepository();
export const vehicleRepository = new SupabaseVehicleRepository();
export const vehicleTypeRepository = new SupabaseVehicleTypeRepository();
export const odometerReadingRepository = new SupabaseOdometerReadingRepository();
export const refuelEventRepository = new SupabaseRefuelEventRepository();
