import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CharacterResponse, toCharacterResponse, toNullableResponse } from './character.response';
import { VoteDto } from './dto/vote.dto';
import { Character } from './schemas/character.schema';

export interface StatsResponse {
  totalVotes: number;
  totalCharacters: number;
  mostLiked: CharacterResponse | null;
  mostDisliked: CharacterResponse | null;
  lastEvaluated: CharacterResponse | null;
}

@Injectable()
export class CharactersService {
  constructor(@InjectModel(Character.name) private readonly characterModel: Model<Character>) {}

  /**
   * Suma un voto en una sola operación atómica: crea el personaje si no
   * existe ($upsert) e incrementa el contador ($inc). Así dos votos al
   * mismo tiempo nunca se pisan.
   */
  async vote({ name, image, universe, type }: VoteDto): Promise<CharacterResponse> {
    const counter = type === 'like' ? 'likes' : 'dislikes';

    const character = await this.characterModel
      .findOneAndUpdate(
        { name, universe },
        { $inc: { [counter]: 1 }, $set: { image, lastVote: type } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      )
      .lean()
      .orFail()
      .exec();

    return toCharacterResponse(character);
  }

  async getStats(): Promise<StatsResponse> {
    const [mostLiked, mostDisliked, lastEvaluated, totals] = await Promise.all([
      this.characterModel.findOne({ likes: { $gt: 0 } }).sort({ likes: -1, updatedAt: -1 }).lean(),
      this.characterModel
        .findOne({ dislikes: { $gt: 0 } })
        .sort({ dislikes: -1, updatedAt: -1 })
        .lean(),
      this.characterModel.findOne().sort({ updatedAt: -1 }).lean(),
      this.characterModel.aggregate<{ votes: number; characters: number }>([
        {
          $group: {
            _id: null,
            votes: { $sum: { $add: ['$likes', '$dislikes'] } },
            characters: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalVotes: totals[0]?.votes ?? 0,
      totalCharacters: totals[0]?.characters ?? 0,
      mostLiked: toNullableResponse(mostLiked),
      mostDisliked: toNullableResponse(mostDisliked),
      lastEvaluated: toNullableResponse(lastEvaluated),
    };
  }

  /** Ranking por puntaje (likes - dislikes); en empate gana quien tenga más likes. */
  async getRanking(limit: number): Promise<CharacterResponse[]> {
    const rows = await this.characterModel.aggregate([
      { $addFields: { score: { $subtract: ['$likes', '$dislikes'] } } },
      { $sort: { score: -1, likes: -1, updatedAt: -1 } },
      { $limit: limit },
    ]);

    return rows.map(toCharacterResponse);
  }
}
