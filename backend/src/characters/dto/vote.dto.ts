import { IsIn, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { UNIVERSES, Universe } from '../../character-sources/character-source';

export const VOTE_TYPES = ['like', 'dislike'] as const;
export type VoteType = (typeof VOTE_TYPES)[number];

export class VoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(500)
  image: string;

  @IsIn([...UNIVERSES])
  universe: Universe;

  @IsIn([...VOTE_TYPES])
  type: VoteType;
}
