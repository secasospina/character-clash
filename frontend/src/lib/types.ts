export type Universe = 'pokemon' | 'rick-and-morty' | 'superhero' | 'naruto';
export type VoteType = 'like' | 'dislike';

/** Personaje recién traído de una API externa (todavía sin votos). */
export interface RandomCharacter {
  name: string;
  image: string;
  universe: Universe;
}

/** Personaje guardado en la base de datos, con sus votos. */
export interface RatedCharacter extends RandomCharacter {
  id: string;
  likes: number;
  dislikes: number;
  score: number;
  lastVote: VoteType | null;
  updatedAt: string;
}

export interface Stats {
  totalVotes: number;
  totalCharacters: number;
  mostLiked: RatedCharacter | null;
  mostDisliked: RatedCharacter | null;
  lastEvaluated: RatedCharacter | null;
}
