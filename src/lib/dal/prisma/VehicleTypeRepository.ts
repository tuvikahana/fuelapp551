import { prisma } from '@/lib/prisma';
import type { IVehicleTypeRepository, CreateVehicleTypeInput, UpdateVehicleTypeInput } from '../interfaces/IVehicleTypeRepository';

export class PrismaVehicleTypeRepository implements IVehicleTypeRepository {
  async findAll() {
    return prisma.vehicleType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.vehicleType.findUnique({ where: { id } });
  }

  async create(data: CreateVehicleTypeInput) {
    return prisma.vehicleType.create({ data });
  }

  async update(id: string, data: UpdateVehicleTypeInput) {
    return prisma.vehicleType.update({ where: { id }, data });
  }
}
