const ADMIN_PIN = process.env.ADMIN_PIN || '6551';

export function verifyAdminPin(pin: string): boolean {
  return pin === ADMIN_PIN;
}

export function getAdminPinHeader(request: Request): string | null {
  return request.headers.get('x-admin-pin');
}

export function isAdminAuthorized(request: Request): boolean {
  const pin = getAdminPinHeader(request);
  return pin !== null && verifyAdminPin(pin);
}
