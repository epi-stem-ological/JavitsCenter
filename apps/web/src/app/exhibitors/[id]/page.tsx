import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seedExhibitors } from '@javits/mock-data';

export default function ExhibitorDetail({ params }: { params: { id: string } }) {
  const x = seedExhibitors.find((e) => e.id === params.id);
  if (!x) notFound();

  return (
    <article className="stack" style={{ gap: 16 }}>
      <h1>{x.name}</h1>
      <div className="muted">Booth {x.boothNumber}</div>
      {x.description ? <p>{x.description}</p> : null}
      {x.website ? (
        <p>
          <a href={x.website} target="_blank" rel="noreferrer">
            {x.website}
          </a>
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link href={`/destinations/${x.destinationId}`} className="button ghost">
          View booth location
        </Link>
        <a href={`wayfinder://destination/${x.destinationId}`} className="button">
          Route in app
        </a>
      </div>
    </article>
  );
}
