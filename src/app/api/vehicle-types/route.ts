import { NextRequest, NextResponse } from 'next/server';
import { vehicleTypeRepository } from '@/lib/dal';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function GET() {
  const types = await vehicleTypeRepository.findAll();
  return NextResponse.json(types);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'סיסמת מנהל שגויה' }, { status: 401 });
  }
  const body = await request.json();
  const type = await vehicleTypeRepository.create(body);
  return NextResponse.json(type, { status: 201 });
}
