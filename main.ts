import { Application } from "@oak/oak";
import configs from "./config/app.config.ts";
import { cors, onError, transformResponse } from "./middlewares/index.ts";
import type { ApplicationState } from "./types/index.ts";
import routers from "./routers/index.ts";
import { PubSub } from "./database/pubsub.ts";

const { server } = configs;
const pubsubAbortController = new AbortController();
const serverAbortController = new AbortController();
const app = new Application<ApplicationState>();

let isShuttingDown = false;

PubSub.on("error", (e) => {
  console.error("[PubSub]", e);
  pubsubAbortController.abort();
});

app.use(cors, transformResponse, onError);
routers.init(app);

app.addEventListener("listen", () => {
  console.info(
    `[Server] Running at ${server.protocol}://${server.host}:${server.port}`,
  );
});
app.addEventListener("error", (event) => {
  console.error(event.error);
  serverAbortController.abort();
});

async function gracefulShutdown() {
  if (isShuttingDown) return; // Prevent multiple shutdown calls
  isShuttingDown = true;

  console.info("[Server] Initiating graceful shutdown...");

  // Abort server and PubSub
  pubsubAbortController.abort();
  serverAbortController.abort();

  try {
    // Close PubSub and perform other shutdown tasks
    await PubSub.close();

    // Allow any other cleanup operations before exiting
    console.info("[Server] Shutdown complete.");
    Deno.exit(0);
  } catch (e) {
    console.error("[Server] Error during shutdown:", e);
    Deno.exit(1); // Exit with failure code if shutdown fails
  }
}

if (import.meta.main) {
  try {
    await PubSub.start({ signal: pubsubAbortController.signal });
    await app.listen({
      port: server.port,
      signal: serverAbortController.signal,
    });
  } catch (e) {
    console.error("[Server] Error during startup:", e);
    Deno.exit(1); // Ensure process exits if startup fails
  }
}

// Graceful shutdown handling
Deno.addSignalListener("SIGINT", gracefulShutdown);
Deno.addSignalListener("SIGTERM", gracefulShutdown);

export { app };
