import type { Context, Next } from "@oak/oak";

export const onError = (ctx: Context, next: Next) => {
  try {
    next();
  } catch (err) {
    ctx.response.body = (err as Error).message || "Internal server error";
    throw err;
  }
};
