import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UNIVERSES, Universe } from '../../character-sources/character-source';
import { VOTE_TYPES, VoteType } from '../dto/vote.dto';

@Schema({ timestamps: true, versionKey: false })
export class Character {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true, enum: [...UNIVERSES] })
  universe: Universe;

  @Prop({ type: Number, default: 0, min: 0 })
  likes: number;

  @Prop({ type: Number, default: 0, min: 0 })
  dislikes: number;

  @Prop({ type: String, enum: [...VOTE_TYPES] })
  lastVote?: VoteType;

  createdAt: Date;
  updatedAt: Date;
}

export type CharacterDocument = HydratedDocument<Character>;
export const CharacterSchema = SchemaFactory.createForClass(Character);

// Un personaje es único por nombre + universo (puede existir "Kakashi" en dos universos)
CharacterSchema.index({ name: 1, universe: 1 }, { unique: true });
CharacterSchema.index({ updatedAt: -1 });
