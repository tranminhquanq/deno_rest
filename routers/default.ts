import { Router } from "@oak/oak";

const router = new Router();

router.get("/(.*)", (ctx) => {
  ctx.response.body = "Hi, I'm a teapot!";
});

export default router;
