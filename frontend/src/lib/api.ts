import type { RandomCharacter, RatedCharacter, Stats, VoteType } from './types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('No hay conexión con la API. Revisa que el backend esté encendido.', 0);
  }

  if (!response.ok) {
    let message = `La API respondió con el error ${response.status}.`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body.message) message = Array.isArray(body.message) ? body.message.join('. ') : body.message;
    } catch {
      // La respuesta no era JSON: dejamos el mensaje genérico
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export const api = {
  getRandomCharacter: () => request<RandomCharacter>('/characters/random'),

  vote: (character: RandomCharacter, type: VoteType) =>
    request<RatedCharacter>('/votes', {
      method: 'POST',
      body: JSON.stringify({ ...character, type }),
    }),

  getStats: () => request<Stats>('/stats'),

  getRanking: (limit = 10) => request<RatedCharacter[]>(`/ranking?limit=${limit}`),
};
