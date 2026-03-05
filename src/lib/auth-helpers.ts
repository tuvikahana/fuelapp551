import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as { role: string }).role !== 'admin') redirect('/vehicles');
  return session;
}

export async function getSession() {
  return auth();
}
