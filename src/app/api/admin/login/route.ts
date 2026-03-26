import { NextRequest, NextResponse } from 'next/server';

import {
  getAdminCookieOptions,
  getAdminCookieValue,
  isValidAdminCredentials,
  ADMIN_COOKIE_NAME,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!isValidAdminCredentials(email, password)) {
      return NextResponse.json({ error: 'E-posta veya sifre hatali.' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, getAdminCookieValue(), getAdminCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: 'Login istegi gecersiz.' }, { status: 400 });
  }
}

