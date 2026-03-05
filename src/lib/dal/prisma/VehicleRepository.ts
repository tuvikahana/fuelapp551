import { prisma } from '@/lib/prisma';
import type { IVehicleRepository, CreateVehicleInput, UpdateVehicleInput } from '../interfaces/IVehicleRepository';

export class PrismaVehicleRepository implements IVehicleRepository {
  async findAll() {
    return prisma.vehicle.findMany({
      include: { vehicleType: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { vehicleType: true },
    });
  }

  async search(query: string) {
    return prisma.vehicle.findMany({
      where: {
        OR: [
          { vehicleNumber: { contains: query } },
          { nickname: { contains: query } },
        ],
      },
      include: { vehicleType: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(data: CreateVehicleInput) {
    return prisma.vehicle.create({ data });
  }

  async update(id: string, data: UpdateVehicleInput) {
    return prisma.vehicle.update({ where: { id }, data });
  }

  async updateOdometer(id: string, confirmedValue: number) {
    return prisma.vehicle.update({
      where: { id },
      data: { latestConfirmedOdometer: confirmedValue },
    });
  }

  async markFullRefuel(id: string, odometerValue: number) {
    return prisma.vehicle.update({
      where: { id },
      data: { lastFullRefuelOdometer: odometerValue },
    });
  }
}
