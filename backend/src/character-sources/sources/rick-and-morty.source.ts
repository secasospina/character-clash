import { Injectable } from '@nestjs/common';
import { CharacterSource, RandomCharacter } from '../character-source';
import { fetchJson } from '../fetch-json';

interface RickAndMortyResponse {
  name: string;
  image: string;
}

@Injectable()
export class RickAndMortySource implements CharacterSource {
  readonly universe = 'rick-and-morty' as const;
  readonly maxId = 826;

  isEnabled() {
    return true;
  }

  async fetchById(id: number): Promise<RandomCharacter | null> {
    const data = await fetchJson<RickAndMortyResponse>(
      `https://rickandmortyapi.com/api/character/${id}`,
    );
    if (!data?.image) return null;

    return { name: data.name, image: data.image, universe: this.universe };
  }
}
