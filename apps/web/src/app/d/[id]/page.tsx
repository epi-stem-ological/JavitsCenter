import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProviders } from '../../../lib/providers';

/**
 * Short deep-link landing. Targeted by QR codes on signage and printed
 * guides. URL pattern: `/d/{destinationId}`.
 *
 * Strategy:
 *  - Universal link (when set up): mobile OS intercepts and opens the app.
 *  - App installed without universal links: "Open in app" triggers
 *    `wayfinder://destination/:id`.
 *  - App not installed: user falls through to the web detail view with a
 *    static floor reference.
 */
export default async function ShortLanding({ params }: { params: { id: string } }) {
  const { destinations } = getProviders();
  const d = await destinations.getDestination(params.id);
  if (!d) notFound();

  return (
    <article className="stack" style={{ gap: 24, paddingTop: 24, maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>{d.name}</h1>
      <div className="muted" style={{ textAlign: 'center' }}>
        {friendlyLocation(d.buildingId, d.floorId)}
        {d.displayCode ? ` · ${d.displayCode}` : ''}
      </div>

      <div className="card stack" style={{ gap: 8, textAlign: 'center' }}>
        <strong>Floor {floorLevel(d.floorId)}</strong>
        <div className="muted" style={{ fontSize: 14 }}>
          Route preview and turn-by-turn navigation are available in the app.
        </div>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        <a href={`wayfinder://destination/${d.id}`} className="button">
          Open in app
        </a>
        <Link href={`/destinations/${d.id}`} className="button ghost">
          View here
        </Link>
      </div>

      <p className="subtle" style={{ fontSize: 12, textAlign: 'center' }}>
        Prototype: blue-dot navigation is only available in the mobile app and
        is simulated. The web view shows destination info only.
      </p>
    </article>
  );
}

function friendlyLocation(buildingId: string, floorId: string): string {
  const b = buildingId.includes('north') ? 'North Building' : buildingId.includes('south') ? 'South Building' : '';
  const l = floorId.split('_').pop()?.toUpperCase() ?? '';
  return [b, l].filter(Boolean).join(' · ');
}

function floorLevel(floorId: string): string {
  return floorId.split('_').pop()?.toUpperCase() ?? '';
}
