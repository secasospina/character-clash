import type { Universe } from './types';

interface UniverseMeta {
  label: string;
  /** Color del marco de la carta */
  color: string;
}

export const UNIVERSES: Record<Universe, UniverseMeta> = {
  pokemon: { label: 'Pokémon', color: '#ffcb05' },
  'rick-and-morty': { label: 'Rick and Morty', color: '#97e05a' },
  superhero: { label: 'Superhéroes', color: '#5aa9ff' },
  naruto: { label: 'Naruto', color: '#ff8a2a' },
};

const numberFormat = new Intl.NumberFormat('es-CO');
export const formatNumber = (value: number) => numberFormat.format(value);
