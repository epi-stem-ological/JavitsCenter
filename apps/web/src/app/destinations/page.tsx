import Link from 'next/link';
import { getProviders } from '../../lib/providers';
import { seedVenues } from '@javits/mock-data';
import type { Destination, DestinationCategory } from '@javits/domain';

export default async function DestinationsIndex() {
  const { destinations } = getProviders();
  const venueId = seedVenues[0]!.id;
  const all = await destinations.listDestinations(venueId);
  const byCategory = groupByCategory(all);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <h1>Destinations</h1>
      <p className="muted">Browse everything at the venue, grouped by category.</p>

      {Array.from(byCategory.entries()).map(([cat, items]) => (
        <section key={cat}>
          <h2 style={{ textTransform: 'capitalize' }}>{cat.replace(/_/g, ' ')}</h2>
          <div className="grid">
            {items.map((d) => (
              <Link key={d.id} href={`/destinations/${d.id}`} style={{ textDecoration: 'none' }}>
                <div className="card stack" style={{ gap: 6 }}>
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
      ))}
    </div>
  );
}

function groupByCategory(list: Destination[]): Map<DestinationCategory, Destination[]> {
  const out = new Map<DestinationCategory, Destination[]>();
  for (const d of list) {
    if (!out.has(d.category)) out.set(d.category, []);
    out.get(d.category)!.push(d);
  }
  return out;
}

function friendlyLocation(buildingId: string, floorId: string): string {
  const level = floorId.split('_').pop() ?? '';
  const levelLabel = level.startsWith('l') ? `Level ${level.slice(1)}` : level.toUpperCase();
  const wing = buildingId.includes('north') ? 'Javits North' : '';
  return [levelLabel, wing].filter(Boolean).join(' · ');
}
