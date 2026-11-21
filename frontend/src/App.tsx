import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterCard, type CardExit } from './components/CharacterCard';
import { Highlights } from './components/Highlights';
import { Ranking } from './components/Ranking';
import { VoteControls } from './components/VoteControls';
import { useCharacterDeck } from './hooks/useCharacterDeck';
import { useScoreboard } from './hooks/useScoreboard';
import { api } from './lib/api';
import type { VoteType } from './lib/types';
import { formatNumber } from './lib/universes';

/** Debe coincidir con la duración de la animación de salida en styles.css */
const EXIT_ANIMATION_MS = 420;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const { state: deck, draw } = useCharacterDeck();
  const { stats, ranking, error: scoreboardError, refresh } = useScoreboard();
  const [exit, setExit] = useState<CardExit>(null);
  const [message, setMessage] = useState('');
  const busy = useRef(false);

  const character = deck.status === 'ready' ? deck.character : null;

  const advance = useCallback(
    async (action: VoteType | 'skip') => {
      if (!character || busy.current) return;
      busy.current = true;
      setExit(action);

      const saving =
        action === 'skip'
          ? Promise.resolve()
          : api
              .vote(character, action)
              .then(() => {
                setMessage(
                  `${action === 'like' ? 'Me gusta' : 'No me gusta'} guardado para ${character.name}.`,
                );
                return refresh();
              })
              .catch((error: Error) => setMessage(`No se guardó tu voto: ${error.message}`));

      await wait(prefersReducedMotion() ? 120 : EXIT_ANIMATION_MS);
      setExit(null);
      await draw();
      await saving;
      busy.current = false;
    },
    [character, draw, refresh],
  );

  // Atajos de teclado: ← no me gusta, → me gusta, S saltar
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea')) return;

      if (event.key === 'ArrowLeft') void advance('dislike');
      else if (event.key === 'ArrowRight') void advance('like');
      else if (event.key.toLowerCase() === 's') void advance('skip');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance]);

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="logo">
          <span className="logo__cards" aria-hidden="true">
            <span />
            <span />
          </span>
          Character Clash
        </h1>
        {stats && (
          <dl className="totals">
            <div>
              <dt>Votos</dt>
              <dd>{formatNumber(stats.totalVotes)}</dd>
            </div>
            <div>
              <dt>Personajes</dt>
              <dd>{formatNumber(stats.totalCharacters)}</dd>
            </div>
          </dl>
        )}
      </header>

      <main className="layout">
        <section className="arena" aria-labelledby="arena-title">
          <h2 id="arena-title" className="arena__title">
            ¿Te gusta este personaje?
          </h2>
          <p className="arena__lead">
            Cada carta sale al azar de Pokémon, Rick and Morty, superhéroes o Naruto.
          </p>

          <div className="arena__table">
            <CharacterCard
              character={character}
              exit={exit}
              error={deck.status === 'error' ? deck.message : undefined}
              onRetry={() => void draw()}
            />
          </div>

          <VoteControls
            disabled={!character || exit !== null}
            onVote={(type) => void advance(type)}
            onSkip={() => void advance('skip')}
          />

          <p className="visually-hidden" aria-live="polite">
            {message}
          </p>
        </section>

        <aside className="board" aria-labelledby="board-title">
          <h2 id="board-title" className="board__title">
            Marcador
          </h2>
          {scoreboardError && (
            <p className="board__error" role="alert">
              No se pudo cargar el marcador. {scoreboardError}
            </p>
          )}
          <Highlights stats={stats} />

          <h2 className="board__title board__title--ranking">Los 10 mejores</h2>
          <Ranking items={ranking} />
        </aside>
      </main>

      <footer className="footer">
        Hecho por{' '}
        <a href="https://github.com/secasospina" target="_blank" rel="noreferrer">
          Sebastián Castaño Ospina
        </a>{' '}
        con NestJS, MongoDB y React.
      </footer>
    </div>
  );
}
