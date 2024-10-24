import { Router } from "@oak/oak";
import { authenticate, authorize } from "../middlewares/index.ts";
import controllers from "../controllers/user.ts";

const router = new Router().use(authenticate);

router.get("/me", authorize("user:read"), controllers.me);

export default router;
