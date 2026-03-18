'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ShellWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
