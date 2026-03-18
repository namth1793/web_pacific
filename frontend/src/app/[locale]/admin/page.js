'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function AdminIndexPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.replace(`/${locale}/admin/dashboard`);
    } else {
      router.replace(`/${locale}/admin/login`);
    }
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
