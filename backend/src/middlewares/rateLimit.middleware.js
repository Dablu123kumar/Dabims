import rateLimit from "express-rate-limit";
import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_MAX,
} from "../config/config.js";

const windowMs = parseInt(RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutes

// General API limiter — applied globally
export const generalLimiter = rateLimit({
  windowMs,
  max: parseInt(RATE_LIMIT_MAX) || 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Auth routes (login, register) — stricter
export const authLimiter = rateLimit({
  windowMs,
  max: parseInt(AUTH_RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

// OTP routes — very strict
export const otpLimiter = rateLimit({
  windowMs,
  max: parseInt(OTP_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many OTP requests, please try again later." },
});
