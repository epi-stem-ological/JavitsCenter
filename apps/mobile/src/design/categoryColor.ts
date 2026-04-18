import type { DestinationCategory } from '@javits/domain';
import type { CategoryColorKey } from './tokens';

export function categoryColorKey(cat: DestinationCategory): CategoryColorKey {
  switch (cat) {
    case 'hall':
      return 'hall';
    case 'food':
    case 'coffee':
      return 'food';
    case 'restroom':
      return 'restroom';
    case 'help_desk':
    case 'info':
    case 'lost_and_found':
      return 'help';
    case 'registration':
      return 'registration';
    case 'exit':
    case 'medical':
      return 'exit';
    case 'elevator':
    case 'escalator':
    case 'stairs':
    case 'entrance':
    case 'parking':
      return 'transit';
    default:
      return 'default';
  }
}

export function categoryLabel(cat: DestinationCategory): string {
  return cat
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
