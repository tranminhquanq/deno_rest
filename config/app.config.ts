import { loadSync } from "@std/dotenv";

function getOptionalConfigFromEnv(
  key: string,
  fallback?: string,
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
    Deno.exit();
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
    protocol: getOptionalConfigFromEnv("SERVER_PROTOCOL") || "http",
    port: parseInt(getConfigFromEnv("SERVER_PORT"), 10),
    host: getConfigFromEnv("SERVER_HOST"),
  },
  postgres: {
    db: getConfigFromEnv("POSTGRES_DB"),
    user: getConfigFromEnv("POSTGRES_USER"),
    password: getConfigFromEnv("POSTGRES_PASSWORD"),
    port: parseInt(getOptionalConfigFromEnv("POSTGRES_PORT") || "5432", 10),
    host: getOptionalConfigFromEnv("POSTGRES_HOST") || "localhost",
    connectionString: getConfigFromEnv("POSTGRES_CONNECTION_STRING"),
  },
} as const;
