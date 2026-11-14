import { Router } from "express";
import { login, logout, refreshToken, requestPasswordReset, resetPassword } from "./auth.controller";
import { loginLimiter, passwordResetRequestLimiter, passwordResetVerifyLimiter } from "../../../middlewares/loginLimiter";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshToken);
router.post(
  "/password-reset/request",
  passwordResetRequestLimiter,
  requestPasswordReset,
);
router.post(
  "/password-reset/confirm",
  passwordResetVerifyLimiter,
  resetPassword,
);
router.post("/logout", logout);

export default router;
