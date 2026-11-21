import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { CHARACTER_SOURCES, CharacterSource, RandomCharacter } from './character-source';

const MAX_ATTEMPTS = 6;

@Injectable()
export class CharacterSourcesService {
  private readonly logger = new Logger(CharacterSourcesService.name);
  private readonly sources: CharacterSource[];

  constructor(@Inject(CHARACTER_SOURCES) sources: CharacterSource[]) {
    this.sources = sources.filter((source) => source.isEnabled());
    this.logger.log(`Universos activos: ${this.sources.map((s) => s.universe).join(', ')}`);
  }

  /**
   * Elige un universo y un id al azar. Si la API falla o el personaje
   * no tiene imagen, lo intenta de nuevo (posiblemente con otro universo).
   */
  async getRandom(): Promise<RandomCharacter> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const source = this.sources[randomInt(this.sources.length)];
      const id = randomInt(1, source.maxId + 1);

      try {
        const character = await source.fetchById(id);
        if (character) return character;
      } catch (error) {
        this.logger.warn(`${source.universe} #${id} falló: ${(error as Error).message}`);
      }
    }

    throw new ServiceUnavailableException(
      'Las APIs de personajes no responden. Intenta de nuevo en unos segundos.',
    );
  }
}
