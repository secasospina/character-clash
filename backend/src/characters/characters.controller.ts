import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CharacterSourcesService } from '../character-sources/character-sources.service';
import { CharactersService } from './characters.service';
import { RankingQueryDto } from './dto/ranking-query.dto';
import { VoteDto } from './dto/vote.dto';

@Controller()
export class CharactersController {
  constructor(
    private readonly charactersService: CharactersService,
    private readonly sourcesService: CharacterSourcesService,
  ) {}

  /** GET /api/characters/random */
  @Get('characters/random')
  getRandom() {
    return this.sourcesService.getRandom();
  }

  /** POST /api/votes — límite más estricto para evitar spam de votos */
  @Post('votes')
  @Throttle({ default: { limit: 40, ttl: 60_000 } })
  vote(@Body() dto: VoteDto) {
    return this.charactersService.vote(dto);
  }

  /** GET /api/stats */
  @Get('stats')
  getStats() {
    return this.charactersService.getStats();
  }

  /** GET /api/ranking?limit=10 */
  @Get('ranking')
  getRanking(@Query() { limit }: RankingQueryDto) {
    return this.charactersService.getRanking(limit);
  }
}
