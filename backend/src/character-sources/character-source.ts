export const UNIVERSES = ['pokemon', 'rick-and-morty', 'superhero', 'naruto'] as const;
export type Universe = (typeof UNIVERSES)[number];

export interface RandomCharacter {
  name: string;
  image: string;
  universe: Universe;
}

/**
 * Contrato que cumple cada API externa de personajes.
 * Para agregar un universo nuevo basta con crear otra clase que lo implemente.
 */
export interface CharacterSource {
  readonly universe: Universe;
  /** Id más alto que existe en la API (los ids van de 1 a maxId). */
  readonly maxId: number;
  isEnabled(): boolean;
  /** Devuelve null si el personaje no existe o no tiene imagen. */
  fetchById(id: number): Promise<RandomCharacter | null>;
}

export const CHARACTER_SOURCES = Symbol('CHARACTER_SOURCES');
