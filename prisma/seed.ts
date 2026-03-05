import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'מנהל מערכת',
      username: 'admin',
      passwordHash: adminHash,
      role: 'admin',
    },
  });

  // Create field user
  const fieldHash = await bcrypt.hash('field123', 10);
  const fieldUser = await prisma.user.upsert({
    where: { username: 'field1' },
    update: {},
    create: {
      name: 'משתמש שטח',
      username: 'field1',
      passwordHash: fieldHash,
      role: 'field_user',
    },
  });

  // Create vehicle type: האמר צבאי
  const vehicleType = await prisma.vehicleType.upsert({
    where: { name: 'האמר צבאי' },
    update: {},
    create: {
      name: 'האמר צבאי',
      fuelTankCapacityLiters: 95,
      estimatedKmPerLiter: 4,
      fuelBandThreshold75: 75,
      fuelBandThreshold50: 50,
      fuelBandThreshold25: 25,
      fuelBandThreshold10: 10,
      actionThresholdPlanRefuel: 35,
      actionThresholdRefuelSoon: 20,
      actionThresholdRefuelNow: 10,
    },
  });

  // Create sample vehicles
  await prisma.vehicle.upsert({
    where: { vehicleNumber: '8201234' },
    update: {},
    create: {
      vehicleNumber: '8201234',
      vehicleTypeId: vehicleType.id,
      nickname: 'האמר 1',
      lastFullRefuelOdometer: 45000,
      latestConfirmedOdometer: 45120,
    },
  });

  await prisma.vehicle.upsert({
    where: { vehicleNumber: '8205678' },
    update: {},
    create: {
      vehicleNumber: '8205678',
      vehicleTypeId: vehicleType.id,
      nickname: 'האמר 2',
      lastFullRefuelOdometer: 32000,
      latestConfirmedOdometer: 32350,
    },
  });

  await prisma.vehicle.upsert({
    where: { vehicleNumber: '8209012' },
    update: {},
    create: {
      vehicleNumber: '8209012',
      vehicleTypeId: vehicleType.id,
      nickname: 'האמר 3',
      notes: 'רכב חדש',
    },
  });

  console.log('Seed completed:', { admin: admin.username, fieldUser: fieldUser.username, vehicleType: vehicleType.name });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
