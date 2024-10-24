import type { Context } from "@oak/oak";
import type { ApplicationState } from "../types/index.ts";

export default {
  me(ctx: Context<ApplicationState>) {
    ctx.response.body = "Me... :)";
  },
};
