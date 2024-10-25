import { defineConfig } from "drizzle-kit";
import configs from "./config/app.config.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schemas/*",
  out: "./database/migrations",
  dbCredentials: {
    user: configs.postgres.user,
    database: configs.postgres.db,
    password: configs.postgres.password,
    host: configs.postgres.host,
    port: configs.postgres.port,
  },
});
