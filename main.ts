import { Application } from "@oak/oak";
import configs from "./config/app.ts";
import { cors, onError, transformResponse } from "./middlewares/index.ts";
import type { ApplicationState } from "./types/index.ts";
import routers from "./routers/index.ts";
import { PubSub } from "./database/pubsub.ts";

const { server } = configs;
const abortController = new AbortController();
const { signal } = abortController;

PubSub.on("error", (e) => {
  console.error("[PubSub]", e);
});

const app = new Application<ApplicationState>();
app.use(cors, transformResponse, onError);
routers.init(app);

app.addEventListener("listen", () => {
  console.info(
    `[Server] Running at ${server.protocol}://${server.host}:${server.port}`,
  );
});
app.addEventListener("error", (event) => {
  console.error(event.error);
  abortController.abort();
});

if (import.meta.main) {
  await PubSub.start({ signal });
  await app.listen({ port: server.port, signal });
}

export { app };
