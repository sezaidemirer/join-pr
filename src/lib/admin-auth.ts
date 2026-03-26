import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const ADMIN_EMAIL = 'info@joinpr.com.tr';
export const ADMIN_PASSWORD = 'escape3589';
export const ADMIN_COOKIE_NAME = 'joinpr_admin_auth';
const ADMIN_COOKIE_VALUE = 'ok';

export function isValidAdminCredentials(email: string, password: string) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  };
}

export function hasAdminCookieInRequest(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
}

export function hasAdminCookieOnServer() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
}

export function getAdminCookieValue() {
  return ADMIN_COOKIE_VALUE;
}

