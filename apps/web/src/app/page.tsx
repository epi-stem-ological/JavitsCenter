import Link from 'next/link';
import { getProviders } from '../lib/providers';
import { seedVenues } from '@javits/mock-data';

export default async function HomePage() {
  const { destinations } = getProviders();
  const venueId = seedVenues[0]!.id;
  const featured = await destinations.listFeatured(venueId);

  return (
    <div className="stack" style={{ gap: 32, paddingTop: 24 }}>
      <section className="stack" style={{ gap: 12 }}>
        <h1>Javits Wayfinder</h1>
        <p className="muted">
          Find halls, meeting rooms, food, help desks, exhibitor booths, and
          more across the Javits Center. Scan a QR code or tap a destination
          below to get started.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Link href="/search" className="button">Search destinations</Link>
          <Link href="/destinations" className="button ghost">Browse all</Link>
        </div>
      </section>

      <section>
        <h2>Featured</h2>
        <div className="grid">
          {featured.map((d) => (
            <Link key={d.id} href={`/destinations/${d.id}`} style={{ textDecoration: 'none' }}>
              <div className="card stack" style={{ gap: 8 }}>
                <strong>{d.name}</strong>
                <div className="muted" style={{ fontSize: 14 }}>
                  {friendlyLocation(d.buildingId, d.floorId)}
                  {d.displayCode ? ` · ${d.displayCode}` : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="disclaimer">
        <strong>Prototype notice —</strong> all indoor positioning in this
        prototype is simulated. Real-time blue-dot navigation will come from
        the Cisco Spaces Wayfinding SDK on iOS and Android.
      </section>
    </div>
  );
}

function friendlyLocation(buildingId: string, floorId: string): string {
  const b = buildingId.includes('north') ? 'North' : buildingId.includes('south') ? 'South' : '';
  const l = floorId.split('_').pop()?.toUpperCase() ?? '';
  return [b, l].filter(Boolean).join(' · ');
}
