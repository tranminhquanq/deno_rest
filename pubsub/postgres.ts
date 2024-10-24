import EventEmitter from "node:events";
import createPostgresSubscriber, { Subscriber } from "npm:pg-listen@1.7.0";
import { APP_ERROR } from "../shared/errors/codes.ts";
import type { PubSubAdapter } from "./adapter.ts";

export class PostgresPubSub extends EventEmitter implements PubSubAdapter {
  isConnected: boolean = false;
  subscriber: Subscriber;

  constructor(connectionString: string) {
    super();

    this.subscriber = createPostgresSubscriber.default(
      { connectionString },
      {
        retryInterval: (attempt: number) => Math.min(attempt * 100, 1000),
        retryTimeout: 60 * 1000 * 60 * 14, // 24h
      },
    );

    this.subscriber.events.on("error", (e: unknown) => {
      this.isConnected = false;
      this.emit("error", e);
    });
  }

  async start(opts?: { signal?: AbortSignal }): Promise<void> {
    if (opts?.signal?.aborted) {
      throw APP_ERROR.Aborted("Postgres pubsub connection aborted");
    }

    await this.subscriber.connect();
    this.isConnected = true;

    if (opts?.signal) {
      opts.signal.addEventListener(
        "abort",
        async () => {
          console.info("[PubSub] Stopping");
          await this.close();
          console.info("[PubSub] Stopped");
        },
        { once: true },
      );
    }

    await Promise.all(
      this.subscriber.notifications
        .eventNames()
        .map((channel: unknown) => this.subscriber.listenTo(channel as string)),
    );
  }

  async close(): Promise<void> {
    this.subscriber.notifications.eventNames().forEach((event: unknown) => {
      this.subscriber.notifications.removeAllListeners(event);
    });
    console.info("[PubSub] Exiting");
    await this.subscriber.close();
    console.info("[PubSub] Exited");
  }

  async publish(channel: string, payload: unknown): Promise<void> {
    await this.subscriber.notify(channel, payload);
  }

  async subscribe<T>(channel: string, cb: (payload: T) => void): Promise<void> {
    const listenerCount = this.subscriber.notifications.listenerCount(channel);
    this.subscriber.notifications.on(channel, cb);

    if (this.isConnected && listenerCount === 0) {
      await this.subscriber.listenTo(channel);
    }
  }

  async unsubscribe<T>(
    channel: string,
    cb: (message: T) => void,
  ): Promise<void> {
    this.subscriber.notifications.removeListener(channel, cb);

    const isListening =
      this.subscriber.notifications.listenerCount(channel) > 0;

    if (!isListening) {
      await this.subscriber.unlisten(channel);
    }
  }
}
