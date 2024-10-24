import EventEmitter from "node:events";
import type { PubSubAdapter } from "./adapter.ts";

export class RedisPubSub extends EventEmitter implements PubSubAdapter {
  constructor() {
    super();
  }

  start(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  publish<T>(_channel: string, _message: T): Promise<void> {
    throw new Error("Method not implemented.");
  }

  subscribe<T>(_channel: string, _cb: (message: T) => void): Promise<void> {
    throw new Error("Method not implemented.");
  }

  unsubscribe<T>(_channel: string, _cb: (message: T) => void): Promise<void> {
    throw new Error("Method not implemented.");
  }

  close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
