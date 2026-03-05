import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pin } = body;

  if (!pin || !verifyAdminPin(pin)) {
    return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
