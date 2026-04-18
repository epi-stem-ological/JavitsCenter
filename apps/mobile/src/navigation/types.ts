import type { Id } from '@javits/domain';

export type RootStackParamList = {
  Home: undefined;
  Search: { initialQuery?: string } | undefined;
  DestinationDetail: { destinationId: Id };
  RoutePreview: { destinationId: Id };
  ActiveNavigation: { sessionId: Id; destinationId: Id };
  Permissions: undefined;
  Settings: undefined;
};
