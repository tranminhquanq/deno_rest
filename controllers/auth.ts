import type { Context } from "@oak/oak";

export default {
  login(ctx: Context) {
    ctx.response.body = "Login";
  },
  register(ctx: Context) {
    ctx.response.body = "Register";
  },
  logout(ctx: Context) {
    ctx.response.body = "Logout";
  },
};
