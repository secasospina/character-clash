import type { CSSProperties } from 'react';
import type { RandomCharacter, VoteType } from '../lib/types';
import { UNIVERSES } from '../lib/universes';

export type CardExit = VoteType | 'skip' | null;

interface Props {
  character: RandomCharacter | null;
  exit: CardExit;
  error?: string;
  onRetry: () => void;
}

const STAMP_TEXT: Record<VoteType, string> = { like: 'Me gusta', dislike: 'No me gusta' };

export function CharacterCard({ character, exit, error, onRetry }: Props) {
  if (error) {
    return (
      <div className="card card--back card--error" role="alert">
        <p className="card__error-title">No pudimos traer un personaje</p>
        <p className="card__error-text">{error}</p>
        <button type="button" className="button button--light" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="card card--back" aria-busy="true">
        <span className="card__back-mark" aria-hidden="true">
          CC
        </span>
        <span className="visually-hidden">Cargando personaje…</span>
      </div>
    );
  }

  const universe = UNIVERSES[character.universe];
  const exitClass = exit ? ` card--exit-${exit}` : '';

  return (
    <article
      key={`${character.universe}-${character.name}`}
      className={`card card--front${exitClass}`}
      style={{ '--universe': universe.color } as CSSProperties}
      aria-label={`${character.name}, de ${universe.label}`}
    >
      <p className="card__universe">{universe.label}</p>
      <div className="card__art">
        <img src={character.image} alt="" referrerPolicy="no-referrer" draggable={false} />
      </div>
      <h2 className="card__name">{character.name}</h2>

      {exit && exit !== 'skip' && (
        <span className={`card__stamp card__stamp--${exit}`} aria-hidden="true">
          {STAMP_TEXT[exit]}
        </span>
      )}
    </article>
  );
}
