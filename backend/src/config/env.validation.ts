const REQUIRED_VARIABLES = ['MONGO_URI'] as const;

/**
 * Falla al arrancar si falta una variable obligatoria,
 * en lugar de fallar más tarde con un error difícil de entender.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const missing = REQUIRED_VARIABLES.filter((name) => !config[name]);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno: ${missing.join(', ')}. Revisa backend/.env.example`,
    );
  }

  return config;
}
