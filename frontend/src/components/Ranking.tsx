import type { RatedCharacter } from '../lib/types';
import { UNIVERSES, formatNumber } from '../lib/universes';
import { Thumbnail } from './Thumbnail';

interface Props {
  items: RatedCharacter[] | null;
}

export function Ranking({ items }: Props) {
  if (!items) {
    return <p className="ranking__empty">Cargando ranking…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="ranking__empty">
        El ranking está vacío. Vota por el personaje de la carta y aparecerá aquí.
      </p>
    );
  }

  return (
    <ol className="ranking">
      {items.map((character, index) => (
        <li key={character.id} className="ranking__row">
          <span className="ranking__position">{index + 1}</span>
          <Thumbnail src={character.image} name={character.name} universe={character.universe} />
          <span className="ranking__who">
            <span className="ranking__name">{character.name}</span>
            <span className="ranking__universe">{UNIVERSES[character.universe].label}</span>
          </span>
          <span className="ranking__votes" aria-label={`${character.likes} me gusta y ${character.dislikes} no me gusta`}>
            <span className="ranking__likes">+{formatNumber(character.likes)}</span>
            <span className="ranking__dislikes">−{formatNumber(character.dislikes)}</span>
          </span>
          <span className="ranking__score" title="Puntaje: me gusta menos no me gusta">
            {character.score > 0 ? '+' : ''}
            {formatNumber(character.score)}
          </span>
        </li>
      ))}
    </ol>
  );
}
