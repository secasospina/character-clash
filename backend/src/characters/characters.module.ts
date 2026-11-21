import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSourcesModule } from '../character-sources/character-sources.module';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character, CharacterSchema } from './schemas/character.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Character.name, schema: CharacterSchema }]),
    CharacterSourcesModule,
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
