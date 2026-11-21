import { Injectable } from '@nestjs/common';
import { CharacterSource, RandomCharacter } from '../character-source';
import { capitalize, fetchJson } from '../fetch-json';

interface PokeApiResponse {
  name: string;
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

@Injectable()
export class PokemonSource implements CharacterSource {
  readonly universe = 'pokemon' as const;
  readonly maxId = 1025;

  isEnabled() {
    return true;
  }

  async fetchById(id: number): Promise<RandomCharacter | null> {
    const data = await fetchJson<PokeApiResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!data) return null;

    const image =
      data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default;
    if (!image) return null;

    return { name: capitalize(data.name), image, universe: this.universe };
  }
}
