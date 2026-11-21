import { Module } from '@nestjs/common';
import { CHARACTER_SOURCES, CharacterSource } from './character-source';
import { CharacterSourcesService } from './character-sources.service';
import { NarutoSource } from './sources/naruto.source';
import { PokemonSource } from './sources/pokemon.source';
import { RickAndMortySource } from './sources/rick-and-morty.source';
import { SuperheroSource } from './sources/superhero.source';

const sources = [PokemonSource, RickAndMortySource, SuperheroSource, NarutoSource];

@Module({
  providers: [
    ...sources,
    {
      provide: CHARACTER_SOURCES,
      inject: sources,
      useFactory: (...instances: CharacterSource[]) => instances,
    },
    CharacterSourcesService,
  ],
  exports: [CharacterSourcesService],
})
export class CharacterSourcesModule {}
