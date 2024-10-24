import { Router } from "@oak/oak";
import { authenticate } from "../middlewares/index.ts";
import controllers from "../controllers/auth.ts";

const router = new Router().prefix("/auth");

router.post("/login", controllers.login);

router.post("/register", controllers.register);

router.post("/logout", authenticate, controllers.logout);

export default router;
