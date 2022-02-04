import { Router } from "express";
import { authControllers } from "../../controllers";
import limiter from "../../midllewares/rate-limit";

const router = new Router();

router.post(
  "/registration",
  limiter(15 * 60 * 1000, 2),
  authControllers.registration
);

export default router;
