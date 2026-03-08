import { NextRequest, NextResponse } from 'next/server';
import { vehicleRepository } from '@/lib/dal';
import { calculateFuelStatus } from '@/lib/services/fuel-calculator';
import { updateVehicleSchema } from '@/lib/validators/vehicle';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vehicle = await vehicleRepository.findById(params.id);
  if (!vehicle) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...vehicle,
    fuelStatus: calculateFuelStatus(
      vehicle.latestConfirmedOdometer,
      vehicle.lastFullRefuelOdometer,
      vehicle.vehicleType
    ),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: '\u05e1\u05d9\u05e1\u05de\u05ea \u05de\u05e0\u05d4\u05dc \u05e9\u05d2\u05d5\u05d9\u05d4' }, { status: 401 });
  }
  const body = await request.json();
  const parsed = updateVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const vehicle = await vehicleRepository.update(params.id, parsed.data);
  return NextResponse.json(vehicle);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'סיסמת מנהל שגויה' }, { status: 401 });
  }
  await vehicleRepository.delete(params.id);
  return new NextResponse(null, { status: 204 });
}
