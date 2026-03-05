import { NextRequest, NextResponse } from 'next/server';
import { vehicleTypeRepository } from '@/lib/dal';
import { updateVehicleTypeSchema } from '@/lib/validators/vehicle';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'סיסמת מנהל שגויה' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateVehicleTypeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await vehicleTypeRepository.update(params.id, parsed.data);
  return NextResponse.json(updated);
}
