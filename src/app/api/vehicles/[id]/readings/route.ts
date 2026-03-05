import { NextRequest, NextResponse } from 'next/server';
import { odometerReadingRepository, refuelEventRepository } from '@/lib/dal';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  const [readings, refuelEvents] = await Promise.all([
    odometerReadingRepository.findByVehicleId(params.id, limit),
    refuelEventRepository.findByVehicleId(params.id, limit),
  ]);

  return NextResponse.json({ readings, refuelEvents });
}
