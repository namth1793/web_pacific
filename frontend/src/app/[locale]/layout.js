import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import ShellWrapper from '@/components/layout/ShellWrapper';
import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }, { locale: 'jp' }];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Toaster position="top-right" />
      <ShellWrapper>{children}</ShellWrapper>
    </NextIntlClientProvider>
  );
}
