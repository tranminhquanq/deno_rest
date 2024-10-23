import { Application } from "@oak/oak";
import configs from "./config/app.ts";
import { cors } from "./middlewares/http.ts";
import { onError } from "./middlewares/error.ts";
import routers from "./routers/index.ts";

const app = new Application();
const abortController = new AbortController();
const { signal } = abortController;

app.use(cors);
app.use(onError);

routers.init(app);

app.addEventListener("listen", () => {
  const { server } = configs;
  console.info(`Environment: ${configs.env}`);
  console.info(
    `Server listening at ${server.protocol}://${server.host}:${server.port}`,
  );
});

app.addEventListener("error", (event) => {
  console.error(event.error);
  abortController.abort();
});

if (import.meta.main) {
  await app.listen({
    port: configs.server.port,
    signal,
  });
}

export { app };
