import { prisma } from '@/lib/prisma';
import type { IOdometerReadingRepository, CreateOdometerReadingInput } from '../interfaces/IOdometerReadingRepository';

export class PrismaOdometerReadingRepository implements IOdometerReadingRepository {
  async create(data: CreateOdometerReadingInput) {
    return prisma.odometerReading.create({ data });
  }

  async findByVehicleId(vehicleId: string, limit = 20) {
    return prisma.odometerReading.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
