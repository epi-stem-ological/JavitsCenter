import Link from 'next/link';
import { seedEvents } from '@javits/mock-data';

export default function EventsIndex() {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <h1>Events</h1>
      <p className="muted">Sessions, keynotes, demos, and networking.</p>
      <div className="grid">
        {seedEvents.map((e) => (
          <Link key={e.id} href={`/events/${e.id}`} style={{ textDecoration: 'none' }}>
            <div className="card stack" style={{ gap: 6 }}>
              <strong>{e.name}</strong>
              <div className="muted" style={{ fontSize: 14 }}>{formatTime(e.startAt)} — {formatTime(e.endAt)}</div>
              <div className="muted" style={{ fontSize: 14 }}>{e.location.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
