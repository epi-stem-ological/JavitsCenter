import Link from 'next/link';
import { seedExhibitors } from '@javits/mock-data';

export default function ExhibitorsIndex() {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <h1>Exhibitors</h1>
      <p className="muted">Companies exhibiting at the venue.</p>
      <div className="grid">
        {seedExhibitors.map((e) => (
          <Link key={e.id} href={`/exhibitors/${e.id}`} style={{ textDecoration: 'none' }}>
            <div className="card stack" style={{ gap: 6 }}>
              <strong>{e.name}</strong>
              <div className="muted" style={{ fontSize: 14 }}>Booth {e.boothNumber}</div>
              {e.description ? <div className="subtle" style={{ fontSize: 13 }}>{e.description}</div> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
