import type { Context } from "@oak/oak";
import type { ApplicationState } from "../types/index.ts";

export default {
  me(ctx: Context<ApplicationState>) {
    const { user } = ctx.state;
    ctx.response.body = user;
  },
};
