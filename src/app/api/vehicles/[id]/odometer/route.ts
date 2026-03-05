import { NextRequest, NextResponse } from 'next/server';
import { vehicleRepository, odometerReadingRepository } from '@/lib/dal';
import { calculateFuelStatus } from '@/lib/services/fuel-calculator';
import { odometerInputSchema } from '@/lib/validators/odometer';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const parsed = odometerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'יש להזין מספר קִִמ תקין' }, { status: 400 });
  }

  const vehicle = await vehicleRepository.findById(params.id);
  if (!vehicle) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (
    vehicle.latestConfirmedOdometer !== null &&
    parsed.data.confirmedValue < vehicle.latestConfirmedOdometer
  ) {
    return NextResponse.json(
      { error: 'לא ניתן להזין קִִמ נמוך מהקריאה האחרונה' },
      { status: 400 }
    );
  }

  await odometerReadingRepository.create({
    vehicleId: params.id,
    inputMethod: parsed.data.inputMethod,
    ocrValue: parsed.data.ocrValue ?? null,
    confirmedValue: parsed.data.confirmedValue,
    imageUrl: parsed.data.imageUrl ?? null,
  });

  await vehicleRepository.updateOdometer(params.id, parsed.data.confirmedValue);
  const updatedWithType = await vehicleRepository.findById(params.id);

  return NextResponse.json({
    ...updatedWithType,
    fuelStatus: calculateFuelStatus(
      updatedWithType!.latestConfirmedOdometer,
      updatedWithType!.lastFullRefuelOdometer,
      updatedWithType!.vehicleType
    ),
  });
}
