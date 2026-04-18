import type { Exhibitor } from '@javits/domain';

export const seedExhibitors: Exhibitor[] = [
  {
    id: 'ex_acme',
    venueId: 'venue_javits',
    name: 'Acme Robotics',
    boothNumber: '4512',
    destinationId: 'dest_booth_4512',
    description: 'Industrial robotics and warehouse automation.',
    category: 'robotics',
    tags: ['robotics', 'automation', 'logistics'],
    website: 'https://example.com/acme',
  },
  {
    id: 'ex_globex',
    venueId: 'venue_javits',
    name: 'Globex Cloud',
    boothNumber: '3481',
    destinationId: 'dest_booth_3481',
    description: 'Cloud infrastructure for enterprise.',
    category: 'software',
    tags: ['cloud', 'infrastructure', 'saas'],
    website: 'https://example.com/globex',
  },
];
