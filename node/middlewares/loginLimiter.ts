import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: "Too many trials , try later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: { message: "Too many requests, try later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts, try later" },
  standardHeaders: true,
  legacyHeaders: false,
});