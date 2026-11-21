import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import type { RandomCharacter } from '../lib/types';

type DeckState =
  | { status: 'loading' }
  | { status: 'ready'; character: RandomCharacter }
  | { status: 'error'; message: string };

const MAX_IMAGE_ATTEMPTS = 4;
const IMAGE_TIMEOUT_MS = 8000;

/**
 * Descarga la imagen antes de mostrarla. Devuelve false si el link está roto,
 * el sitio la bloquea o tarda demasiado.
 */
function imageLoads(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), IMAGE_TIMEOUT_MS);
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      clearTimeout(timer);
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    img.src = src;
  });
}

/** Trae un personaje cuya imagen sí cargue; si no, pide otro. */
async function fetchCharacter(): Promise<RandomCharacter> {
  for (let attempt = 1; attempt <= MAX_IMAGE_ATTEMPTS; attempt++) {
    const character = await api.getRandomCharacter();
    if (await imageLoads(character.image)) return character;
  }
  throw new Error('Las imágenes de los personajes no están cargando. Intenta de nuevo.');
}

/**
 * Maneja el "mazo": la carta visible y la siguiente, que se trae
 * por adelantado para que al votar el cambio sea inmediato.
 */
export function useCharacterDeck() {
  const [state, setState] = useState<DeckState>({ status: 'loading' });
  const nextCard = useRef<Promise<RandomCharacter> | null>(null);

  const prefetch = () => {
    const promise = fetchCharacter();
    promise.catch(() => undefined); // evita "unhandled rejection"; el error se maneja al usarla
    nextCard.current = promise;
  };

  const draw = useCallback(async () => {
    setState({ status: 'loading' });
    const pending = nextCard.current ?? fetchCharacter();
    nextCard.current = null;

    try {
      const character = await pending;
      setState({ status: 'ready', character });
      prefetch();
    } catch (error) {
      setState({ status: 'error', message: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    void draw();
  }, [draw]);

  return { state, draw };
}
