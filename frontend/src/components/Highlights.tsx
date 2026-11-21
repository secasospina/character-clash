import type { RatedCharacter, Stats } from '../lib/types';
import { UNIVERSES, formatNumber } from '../lib/universes';
import { Thumbnail } from './Thumbnail';

interface HighlightProps {
  title: string;
  character: RatedCharacter | null;
  detail: (character: RatedCharacter) => string;
}

function Highlight({ title, character, detail }: HighlightProps) {
  return (
    <li className="highlight">
      <h3 className="highlight__title">{title}</h3>
      {character ? (
        <div className="highlight__body">
          <Thumbnail
            key={character.id}
            src={character.image}
            name={character.name}
            universe={character.universe}
            size="medium"
          />
          <div>
            <p className="highlight__name">{character.name}</p>
            <p className="highlight__detail">
              {detail(character)}
              <span className="highlight__universe">{UNIVERSES[character.universe].label}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="highlight__empty">Todavía nadie</p>
      )}
    </li>
  );
}

const plural = (value: number, singular: string, pluralWord: string) =>
  `${formatNumber(value)} ${value === 1 ? singular : pluralWord}`;

export function Highlights({ stats }: { stats: Stats | null }) {
  return (
    <ul className="highlights">
      <Highlight
        title="El más querido"
        character={stats?.mostLiked ?? null}
        detail={(c) => plural(c.likes, 'me gusta', 'me gusta')}
      />
      <Highlight
        title="El más rechazado"
        character={stats?.mostDisliked ?? null}
        detail={(c) => plural(c.dislikes, 'no me gusta', 'no me gusta')}
      />
      <Highlight
        title="Último votado"
        character={stats?.lastEvaluated ?? null}
        detail={(c) => (c.lastVote === 'dislike' ? 'Recibió un no me gusta' : 'Recibió un me gusta')}
      />
    </ul>
  );
}
