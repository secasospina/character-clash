import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CharacterSource, RandomCharacter } from '../character-source';
import { fetchJson } from '../fetch-json';

interface NarutoResponse {
  name: string;
  images?: string[];
}

@Injectable()
export class NarutoSource implements CharacterSource {
  readonly universe = 'naruto' as const;
  readonly maxId = 1400;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config
      .get<string>('NARUTO_API_URL', 'https://dattebayo-api.onrender.com')
      .replace(/\/$/, '');
  }

  isEnabled() {
    return true;
  }

  async fetchById(id: number): Promise<RandomCharacter | null> {
    // Esta API puede tardar en "despertar", por eso el timeout es mayor
    const data = await fetchJson<NarutoResponse>(`${this.baseUrl}/characters/${id}`, 10_000);
    const image = data?.images?.[0];
    if (!data || !image) return null;

    return { name: data.name, image, universe: this.universe };
  }
}
