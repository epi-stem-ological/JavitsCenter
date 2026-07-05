import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProviders } from '../../../lib/providers';

export default async function DestinationDetail({ params }: { params: { id: string } }) {
  const { destinations } = getProviders();
  const d = await destinations.getDestination(params.id);
  if (!d) notFound();

  return (
    <article className="stack" style={{ gap: 20 }}>
      <div className="stack" style={{ gap: 6 }}>
        <h1>{d.name}</h1>
        <div className="muted">
          {friendlyLocation(d.buildingId, d.floorId)}
          {d.displayCode ? ` · ${d.displayCode}` : ''}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="badge">{d.category.replace(/_/g, ' ')}</span>
        {d.tags.map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
      </div>

      {d.description ? <p>{d.description}</p> : null}

      <div className="card stack" style={{ gap: 4 }}>
        <strong>Position</strong>
        <div className="muted" style={{ fontSize: 14 }}>
          x: {d.position.x.toFixed(1)}, y: {d.position.y.toFixed(1)} · floor {d.floorId}
        </div>
        <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
          Coordinates are in the floor's local meter frame. In the mobile app,
          this destination is navigable with a route preview.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <a href={`wayfinder://destination/${d.id}`} className="button">
          Open in app
        </a>
        <Link href={`/d/${d.id}`} className="button ghost">
          Short link
        </Link>
      </div>
    </article>
  );
}

function friendlyLocation(buildingId: string, floorId: string): string {
  const level = floorId.split('_').pop() ?? '';
  const levelLabel = level.startsWith('l') ? `Level ${level.slice(1)}` : level.toUpperCase();
  const wing = buildingId.includes('north') ? 'Javits North' : '';
  return [levelLabel, wing].filter(Boolean).join(' · ');
}
