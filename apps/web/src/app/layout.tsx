import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Javits Wayfinder',
  description: 'Find and navigate to destinations at the Javits Center.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="container" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <div className="row">
              <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
                Javits Wayfinder
              </Link>
              <nav style={{ display: 'flex', gap: 16 }}>
                <Link href="/destinations" className="muted">Destinations</Link>
                <Link href="/events" className="muted">Events</Link>
                <Link href="/exhibitors" className="muted">Exhibitors</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="container" style={{ fontSize: 13, color: 'var(--fg-tertiary)', paddingTop: 40 }}>
          <p>
            Prototype build — positioning is simulated. In production, indoor
            positioning is provided by the Cisco Spaces Wayfinding SDK (iOS &amp;
            Android).
          </p>
        </footer>
      </body>
    </html>
  );
}
