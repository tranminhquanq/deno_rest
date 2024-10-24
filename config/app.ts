import { loadSync } from "@std/dotenv";

function getOptionalConfigFromEnv(
  key: string,
  fallback?: string
): string | undefined {
  const envValue = Deno.env.get(key);

  if (!envValue && fallback) {
    return getOptionalConfigFromEnv(fallback);
  }

  return envValue;
}

function getConfigFromEnv(key: string, fallbackEnv?: string): string {
  const value = getOptionalConfigFromEnv(key);
  if (!value) {
    if (fallbackEnv) {
      return getConfigFromEnv(fallbackEnv);
    }
    console.error("[Server]", new Error(`${key} is undefined`));
    Deno.exit(1);
  }
  return value;
}

const env = getOptionalConfigFromEnv("ENV") || "local";
const envPath = `.env.${env}`;

loadSync({
  envPath,
  export: true,
});

export default {
  env,
  server: {
    protocol: getOptionalConfigFromEnv("PROTOCOL") || "http",
    port: parseInt(getOptionalConfigFromEnv("PORT") || "8000"),
    host: getOptionalConfigFromEnv("HOST") || "localhost",
  },
  postgres: {
    connectionString: getConfigFromEnv("POSTGRES_CONNECTION_STRING"),
  },
} as const;
