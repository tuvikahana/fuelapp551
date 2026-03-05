import { prisma } from '@/lib/prisma';
import type { IRefuelEventRepository, CreateRefuelEventInput } from '../interfaces/IRefuelEventRepository';

export class PrismaRefuelEventRepository implements IRefuelEventRepository {
  async create(data: CreateRefuelEventInput) {
    return prisma.refuelEvent.create({ data });
  }

  async findByVehicleId(vehicleId: string, limit = 20) {
    return prisma.refuelEvent.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
