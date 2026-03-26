'use client';

import { usePathname } from 'next/navigation';

import { AppShell } from '@/components/AppShell';

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdminPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/admin-dashboard');
  const isProjectPublicPath = pathname.startsWith('/proje/');
  const isStoryboardPath = pathname.startsWith('/vitrin-clinic-storyboard');
  const isRoyalSarayPath = pathname.startsWith('/royal-saray-resort-bahrain');

  if (isAdminPath || isProjectPublicPath || isStoryboardPath || isRoyalSarayPath) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}

