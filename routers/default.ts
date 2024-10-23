import { Router } from "@oak/oak";

const router = new Router();

router.get("/(.*)", (ctx) => {
  ctx.response.body = "Hello world!";
  ctx.response.status = 200;
});

export default router;
