import { redirect } from 'next/navigation';

/** Eski yer imleri icin; asil panel `/admin`. */
export default function AdminDashboardRedirectPage() {
  redirect('/admin');
}
