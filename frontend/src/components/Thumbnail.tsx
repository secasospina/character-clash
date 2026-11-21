import { useState, type CSSProperties } from 'react';
import type { Universe } from '../lib/types';
import { UNIVERSES } from '../lib/universes';

interface Props {
  src: string;
  name: string;
  universe: Universe;
  size?: 'small' | 'medium';
}

/** Miniatura con el color del universo; si la imagen falla, muestra la inicial. */
export function Thumbnail({ src, name, universe, size = 'small' }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`thumb thumb--${size}`}
      style={{ '--universe': UNIVERSES[universe].color } as CSSProperties}
    >
      {failed ? (
        <span className="thumb__initial" aria-hidden="true">
          {name.charAt(0)}
        </span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
