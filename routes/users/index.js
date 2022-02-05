const express = require("express");
const router = express.Router();
const AuthControllers = require("../../controllers/auth");
const { limiter } = require("../../middlewares");
const { guard } = require("../../middlewares");
// import { validationUserLogin } from "./validation";

const authControllers = new AuthControllers();

router.post(
  "/registration",
  limiter(15 * 60 * 1000, 2),
  authControllers.registration
);
router.post("/login", authControllers.login);
router.patch("/balance", guard, authControllers.updateBalance);

module.exports = router;
