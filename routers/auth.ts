import { Router } from "@oak/oak";
import controllers from "../controllers/auth.ts";

const router = new Router().prefix("/auth");

router.post("/login", controllers.login);

router.post("/register", controllers.register);

router.post("/logout", controllers.logout);

export default router;
