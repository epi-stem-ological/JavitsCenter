import { Ionicons } from '@expo/vector-icons';
import type { DestinationCategory, Maneuver } from '@javits/domain';

type IconName = keyof typeof Ionicons.glyphMap;

export function iconForCategory(cat: DestinationCategory): IconName {
  switch (cat) {
    case 'hall':
      return 'business';
    case 'meeting_room':
      return 'easel';
    case 'registration':
      return 'barcode';
    case 'help_desk':
      return 'information-circle';
    case 'info':
      return 'information-circle-outline';
    case 'restroom':
      return 'man';
    case 'food':
      return 'restaurant';
    case 'coffee':
      return 'cafe';
    case 'elevator':
      return 'arrow-up';
    case 'stairs':
      return 'footsteps';
    case 'escalator':
      return 'trending-up';
    case 'entrance':
      return 'enter';
    case 'exit':
      return 'exit';
    case 'parking':
      return 'car';
    case 'atm':
      return 'cash';
    case 'exhibitor_booth':
      return 'storefront';
    case 'medical':
      return 'medkit';
    case 'lost_and_found':
      return 'help-buoy';
    case 'coat_check':
      return 'shirt';
    default:
      return 'location';
  }
}

export function iconForManeuver(m: Maneuver): IconName {
  switch (m) {
    case 'depart':
    case 'straight':
      return 'arrow-up';
    case 'slight_left':
    case 'turn_left':
    case 'sharp_left':
      return 'arrow-undo';
    case 'slight_right':
    case 'turn_right':
    case 'sharp_right':
      return 'arrow-redo';
    case 'uturn':
      return 'refresh';
    case 'take_elevator':
      return 'arrow-up-circle';
    case 'take_escalator':
      return 'trending-up';
    case 'take_stairs':
      return 'footsteps';
    case 'enter_building':
      return 'enter';
    case 'exit_building':
      return 'exit';
    case 'arrive':
      return 'flag';
  }
}
