import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seedEvents } from '@javits/mock-data';

export default function EventDetail({ params }: { params: { id: string } }) {
  const e = seedEvents.find((x) => x.id === params.id);
  if (!e) notFound();

  return (
    <article className="stack" style={{ gap: 16 }}>
      <h1>{e.name}</h1>
      <div className="muted">
        {formatTime(e.startAt)} — {formatTime(e.endAt)}
      </div>
      {e.description ? <p>{e.description}</p> : null}
      {e.speakers && e.speakers.length > 0 ? (
        <p className="muted">With: {e.speakers.join(', ')}</p>
      ) : null}
      <div className="card stack" style={{ gap: 6 }}>
        <strong>Location</strong>
        <Link href={`/destinations/${e.location.id}`}>{e.location.name}</Link>
      </div>
      <div>
        <a href={`wayfinder://destination/${e.location.id}`} className="button">
          Route in app
        </a>
      </div>
    </article>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
