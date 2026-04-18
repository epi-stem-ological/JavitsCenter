import type {
  Destination,
  DestinationCategory,
  DestinationFilter,
  Id,
  SearchContext,
  SearchResult,
} from '@javits/domain';
import type { DestinationProvider } from '../interfaces/DestinationProvider.js';
import { seedDestinations, seedExhibitors } from '@javits/mock-data';

/**
 * MOCK — in-memory fuzzy search. Scoring combines:
 *   - normalized token match on name (weight 3)
 *   - prefix match on booth / display code (weight 4)
 *   - tag match (weight 1.5)
 *   - trigram overlap for typo tolerance (weight 1)
 *
 * Good enough for prototype. In production swap for a real search index.
 */
export class MockDestinationProvider implements DestinationProvider {
  private readonly destinations: Destination[];
  private readonly exhibitorByDestinationId: Map<Id, string>;

  constructor(destinations: Destination[] = seedDestinations) {
    this.destinations = destinations;
    this.exhibitorByDestinationId = new Map(
      seedExhibitors.map((e) => [e.destinationId, e.name])
    );
  }

  async listDestinations(venueId: Id, filter?: DestinationFilter): Promise<Destination[]> {
    return this.destinations.filter((d) => {
      if (d.venueId !== venueId) return false;
      if (filter?.buildingId && d.buildingId !== filter.buildingId) return false;
      if (filter?.floorId && d.floorId !== filter.floorId) return false;
      if (filter?.category && d.category !== filter.category) return false;
      if (filter?.tag && !d.tags.includes(filter.tag)) return false;
      if (filter?.featuredOnly && !d.isFeatured) return false;
      return true;
    });
  }

  async getDestination(id: Id): Promise<Destination | null> {
    return this.destinations.find((d) => d.id === id) ?? null;
  }

  async listByCategory(venueId: Id, category: DestinationCategory): Promise<Destination[]> {
    return this.listDestinations(venueId, { category });
  }

  async listFeatured(venueId: Id): Promise<Destination[]> {
    return this.listDestinations(venueId, { featuredOnly: true });
  }

  async search(query: string, ctx: SearchContext): Promise<SearchResult[]> {
    const q = normalize(query);
    if (!q) return [];

    const limit = ctx.limit ?? 20;

    const results: SearchResult[] = [];
    for (const d of this.destinations) {
      if (d.venueId !== ctx.venueId) continue;

      const name = normalize(d.name);
      const code = d.displayCode ? normalize(d.displayCode) : '';
      const exhibitor = normalize(this.exhibitorByDestinationId.get(d.id) ?? '');
      const tags = d.tags.map(normalize);
      const desc = normalize(d.description ?? '');

      const matched: SearchResult['matchedFields'] = [];
      let score = 0;

      if (code && code.startsWith(q)) {
        score += 4;
        matched.push('booth');
      }
      if (containsToken(name, q)) {
        score += 3;
        matched.push('name');
      }
      if (tags.some((t) => containsToken(t, q))) {
        score += 1.5;
        matched.push('tag');
      }
      if (exhibitor && containsToken(exhibitor, q)) {
        score += 2.5;
        matched.push('exhibitor');
      }
      if (desc && containsToken(desc, q)) {
        score += 0.5;
        matched.push('description');
      }
      // Typo tolerance via trigram overlap on name.
      const tri = trigramOverlap(q, name);
      if (tri > 0.35) score += tri;

      if (score > 0) {
        const entry: SearchResult = {
          kind: 'destination',
          destination: d,
          score,
          matchedFields: uniq(matched),
        };
        if (ctx.origin && ctx.origin.floorId === d.floorId) {
          const dx = ctx.origin.x - d.position.x;
          const dy = ctx.origin.y - d.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          entry.distanceMeters = Math.round(dist);
          entry.etaSec = Math.round(dist / 1.2);
        }
        results.push(entry);
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsToken(haystack: string, needle: string): boolean {
  if (!needle) return false;
  if (haystack.includes(needle)) return true;
  const tokens = haystack.split(' ');
  return tokens.some((t) => t.startsWith(needle));
}

function trigrams(s: string): Set<string> {
  const out = new Set<string>();
  const padded = `  ${s}  `;
  for (let i = 0; i < padded.length - 2; i++) {
    out.add(padded.slice(i, i + 3));
  }
  return out;
}

function trigramOverlap(a: string, b: string): number {
  if (!a || !b) return 0;
  const A = trigrams(a);
  const B = trigrams(b);
  let overlap = 0;
  for (const t of A) if (B.has(t)) overlap++;
  return overlap / Math.max(A.size, 1);
}

function uniq<T>(xs: T[]): T[] {
  return Array.from(new Set(xs));
}
