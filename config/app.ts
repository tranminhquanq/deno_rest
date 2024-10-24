import { loadSync } from "@std/dotenv";

const env = Deno.env.get("ENV") || "local";
const envPath = `.env.${env}`;

loadSync({
  envPath,
  export: true,
});

export default {
  env,
  server: {
    protocol: Deno.env.get("PROTOCOL") || "http",
    port: parseInt(Deno.env.get("PORT") || "8000"),
    host: Deno.env.get("HOST") || "localhost",
  },
  postgres: {
    connectionString: Deno.env.get("DATABASE_URL")!,
  },
} as const;
