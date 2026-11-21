import { Types } from 'mongoose';
import { Universe } from '../character-sources/character-source';
import { VoteType } from './dto/vote.dto';

/** Forma pública de un personaje: lo que ve el frontend. */
export interface CharacterResponse {
  id: string;
  name: string;
  image: string;
  universe: Universe;
  likes: number;
  dislikes: number;
  score: number;
  lastVote: VoteType | null;
  updatedAt: Date;
}

interface StoredCharacter {
  _id: Types.ObjectId;
  name: string;
  image: string;
  universe: Universe;
  likes: number;
  dislikes: number;
  lastVote?: VoteType;
  updatedAt: Date;
}

export function toCharacterResponse(doc: StoredCharacter): CharacterResponse {
  return {
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    universe: doc.universe,
    likes: doc.likes,
    dislikes: doc.dislikes,
    score: doc.likes - doc.dislikes,
    lastVote: doc.lastVote ?? null,
    updatedAt: doc.updatedAt,
  };
}

export function toNullableResponse(doc: StoredCharacter | null): CharacterResponse | null {
  return doc ? toCharacterResponse(doc) : null;
}
