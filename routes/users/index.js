const express = require("express");
const router = express.Router();
const AuthControllers = require("../../controllers/auth");
const {
  googleAuth,
  googleRedirect,
} = require("../../controllers/google/auth-google");
const { limiter } = require("../../middlewares");
const { guard } = require("../../middlewares");
const { validateCreateUser, validationUserId } = require("./validation");
const { upload } = require("../../middlewares");

const authControllers = new AuthControllers();
router.post(
  "/registration",
  limiter(15 * 60 * 1000, 2),
  validateCreateUser,
  authControllers.registration
);
router.patch(
  "/avatar",
  guard,
  upload.single("avatar"),
  authControllers.uploadAvatar
);
router.post("/login", authControllers.login);
router.post("/logout", guard, validationUserId, authControllers.logout);

// router.get("/verify/:token", authControllers.verifyUser);
// router.post("/verify", authControllers.repeatVerifyUser);

router.get("/current", guard, upload.single("avatar"), authControllers.current);
router.patch("/balance", guard, authControllers.updateBalance);
router.get("/google", googleAuth);
router.get("/google-redirect", googleRedirect);

module.exports = router;
