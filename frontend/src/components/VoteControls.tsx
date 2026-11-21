import type { VoteType } from '../lib/types';

interface Props {
  disabled: boolean;
  onVote: (type: VoteType) => void;
  onSkip: () => void;
}

export function VoteControls({ disabled, onVote, onSkip }: Props) {
  return (
    <div className="controls">
      <div className="controls__buttons">
        <button
          type="button"
          className="vote-button vote-button--dislike"
          onClick={() => onVote('dislike')}
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span>No me gusta</span>
        </button>

        <button type="button" className="skip-button" onClick={onSkip} disabled={disabled}>
          Saltar
        </button>

        <button
          type="button"
          className="vote-button vote-button--like"
          onClick={() => onVote('like')}
          disabled={disabled}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
          <span>Me gusta</span>
        </button>
      </div>

      <p className="controls__hint">
        También con el teclado: <kbd>←</kbd> no me gusta, <kbd>S</kbd> saltar, <kbd>→</kbd> me
        gusta
      </p>
    </div>
  );
}
