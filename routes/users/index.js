import { Router } from "express";
import { authControllers } from "../../controllers";
import { limiter } from "../../middlewares";

// import { validationUserLogin } from "./validation";

const router = new Router();

router.post(
  "/registration",
  limiter(15 * 60 * 1000, 2),
  authControllers.registration
);
router.post("/login", authControllers.login);

export default router;
