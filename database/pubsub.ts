import { PostgresPubSub } from "../pubsub/index.ts";
import configs from "../config/app.ts";

export const PubSub = new PostgresPubSub(configs.postgres.connectionString);