import type { Exhibitor } from '@javits/domain';

/** SAMPLE exhibitors, aligned with the design brief's Flow A (Booth 1845). */
export const seedExhibitors: Exhibitor[] = [
  {
    id: 'ex_acme',
    venueId: 'venue_javits',
    name: 'Acme Robotics',
    boothNumber: '1845',
    destinationId: 'dest_booth_1845',
    description: 'Industrial robotics and warehouse automation. (Sample data)',
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
    description: 'Cloud infrastructure for enterprise. (Sample data)',
    category: 'software',
    tags: ['cloud', 'infrastructure', 'saas'],
    website: 'https://example.com/globex',
  },
];
