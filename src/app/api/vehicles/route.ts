import { NextRequest, NextResponse } from 'next/server';
import { vehicleRepository } from '@/lib/dal';
import { calculateFuelStatus } from '@/lib/services/fuel-calculator';
import { createVehicleSchema } from '@/lib/validators/vehicle';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const vehicles = q
    ? await vehicleRepository.search(q)
    : await vehicleRepository.findAll();

  const vehiclesWithStatus = vehicles.map((vehicle) => ({
    ...vehicle,
    fuelStatus: calculateFuelStatus(
      vehicle.latestConfirmedOdometer,
      vehicle.lastFullRefuelOdometer,
      vehicle.vehicleType
    ),
  }));

  return NextResponse.json(vehiclesWithStatus);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'סיסמת מנהל שגויה' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vehicle = await vehicleRepository.create(parsed.data);
  return NextResponse.json(vehicle, { status: 201 });
}
