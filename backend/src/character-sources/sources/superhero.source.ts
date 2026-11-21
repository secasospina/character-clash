import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CharacterSource, RandomCharacter } from '../character-source';
import { fetchJson } from '../fetch-json';

interface SuperheroResponse {
  response: 'success' | 'error';
  name?: string;
  image?: { url?: string };
}

@Injectable()
export class SuperheroSource implements CharacterSource {
  readonly universe = 'superhero' as const;
  readonly maxId = 731;
  private readonly apiKey: string | undefined;

  constructor(config: ConfigService) {
    // La key vive en el .env, nunca en el código
    this.apiKey = config.get<string>('SUPERHERO_API_KEY') || undefined;
  }

  isEnabled() {
    return Boolean(this.apiKey);
  }

  async fetchById(id: number): Promise<RandomCharacter | null> {
    const data = await fetchJson<SuperheroResponse>(
      `https://superheroapi.com/api.php/${this.apiKey}/${id}`,
    );
    if (!data || data.response !== 'success' || !data.name || !data.image?.url) return null;

    return { name: data.name, image: data.image.url, universe: this.universe };
  }
}
