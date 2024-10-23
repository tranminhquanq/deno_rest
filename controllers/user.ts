import type { Context } from "@oak/oak";

export default {
  me(ctx: Context) {
    ctx.response.body = "Me...";
  },
};
