/**
 * GET con timeout usando el fetch nativo de Node.
 * Devuelve null cuando la API responde 404 (el personaje no existe).
 */
export async function fetchJson<T>(url: string, timeoutMs = 6000): Promise<T | null> {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return (await response.json()) as T;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
