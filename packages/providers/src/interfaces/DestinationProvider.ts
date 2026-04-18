import type {
  Destination,
  DestinationCategory,
  DestinationFilter,
  Id,
  SearchContext,
  SearchResult,
} from '@javits/domain';

/**
 * Destination catalog and search. In production this is a combination of a
 * CMS (content) and a search index (Algolia/Typesense/OpenSearch). In the
 * prototype it is an in-memory fuzzy matcher over seed data.
 */
export interface DestinationProvider {
  listDestinations(venueId: Id, filter?: DestinationFilter): Promise<Destination[]>;
  getDestination(id: Id): Promise<Destination | null>;
  listByCategory(venueId: Id, category: DestinationCategory): Promise<Destination[]>;
  listFeatured(venueId: Id): Promise<Destination[]>;
  search(query: string, ctx: SearchContext): Promise<SearchResult[]>;
}
