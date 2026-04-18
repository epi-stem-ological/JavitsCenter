import Link from 'next/link';
import { getProviders } from '../../lib/providers';
import { seedVenues } from '@javits/mock-data';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q ?? '').trim();
  const { destinations } = getProviders();
  const venueId = seedVenues[0]!.id;
  const results = q ? await destinations.search(q, { venueId, limit: 40 }) : [];

  return (
    <div className="stack" style={{ gap: 20 }}>
      <h1>Search</h1>
      <form action="/search" method="get">
        <input type="search" name="q" placeholder="Search halls, booths, food…" defaultValue={q} />
      </form>

      {!q ? (
        <p className="muted">Start typing to search destinations and exhibitors.</p>
      ) : results.length === 0 ? (
        <p className="muted">No matches for "{q}". Try a different term.</p>
      ) : (
        <div className="grid">
          {results.map((r) => (
            <Link key={r.destination.id} href={`/destinations/${r.destination.id}`} style={{ textDecoration: 'none' }}>
              <div className="card stack" style={{ gap: 6 }}>
                <strong>{r.destination.name}</strong>
                <div className="muted" style={{ fontSize: 14 }}>
                  {r.destination.category.replace(/_/g, ' ')}
                  {r.destination.displayCode ? ` · ${r.destination.displayCode}` : ''}
                </div>
                <div className="subtle" style={{ fontSize: 12 }}>matched on: {r.matchedFields.join(', ')}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
