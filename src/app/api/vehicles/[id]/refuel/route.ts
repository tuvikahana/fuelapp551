import { NextRequest, NextResponse } from 'next/server';
import { vehicleRepository, refuelEventRepository } from '@/lib/dal';
import { calculateFuelStatus } from '@/lib/services/fuel-calculator';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vehicle = await vehicleRepository.findById(params.id);
  if (!vehicle) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (vehicle.latestConfirmedOdometer === null) {
    return NextResponse.json(
      { error: 'לא ניתן לסמן תדלוק לפני הזנת קִִמ עדכני' },
      { status: 400 }
    );
  }

  await refuelEventRepository.create({
    vehicleId: params.id,
    odometerAtRefuel: vehicle.latestConfirmedOdometer,
  });

  await vehicleRepository.markFullRefuel(params.id, vehicle.latestConfirmedOdometer);
  const updated = await vehicleRepository.findById(params.id);

  return NextResponse.json({
    ...updated,
    fuelStatus: calculateFuelStatus(
      updated!.latestConfirmedOdometer,
      updated!.lastFullRefuelOdometer,
      updated!.vehicleType
    ),
  });
}
