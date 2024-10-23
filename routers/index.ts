import type { Application } from "@oak/oak";
import defaultRouter from "./default.ts";
import authRouter from "./auth.ts";
import userRouter from "./user.ts";

const init = (app: Application) => {
  app.use(authRouter.routes());
  app.use(authRouter.allowedMethods());

  app.use(userRouter.routes());
  app.use(userRouter.allowedMethods());

  app.use(defaultRouter.routes());
  app.use(defaultRouter.allowedMethods());
};

export default { init };
