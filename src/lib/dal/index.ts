import { PrismaUserRepository } from './prisma/UserRepository';
import { PrismaVehicleRepository } from './prisma/VehicleRepository';
import { PrismaVehicleTypeRepository } from './prisma/VehicleTypeRepository';
import { PrismaOdometerReadingRepository } from './prisma/OdometerReadingRepository';
import { PrismaRefuelEventRepository } from './prisma/RefuelEventRepository';

// Single point of change when swapping persistence layer
export const userRepository = new PrismaUserRepository();
export const vehicleRepository = new PrismaVehicleRepository();
export const vehicleTypeRepository = new PrismaVehicleTypeRepository();
export const odometerReadingRepository = new PrismaOdometerReadingRepository();
export const refuelEventRepository = new PrismaRefuelEventRepository();
