import { Router } from "@oak/oak";
import { authenticate, authorize } from "../middlewares/auth.ts";
import controllers from "../controllers/user.ts";

const router = new Router().use(authenticate);

router.get("/me", authorize("read"), controllers.me);

export default router;
