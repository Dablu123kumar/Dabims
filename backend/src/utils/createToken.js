import jwt from "jsonwebtoken"
import {
  JWT_SECRET,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  NODE_ENV,
} from "../config/config.js"

// Legacy single-token generator (kept for backwards compatibility)
export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' })
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  })
  return token
}

// Short-lived access token (15m)
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET || JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN || "15m",
  })
}

// Long-lived refresh token (7d) — stored in httpOnly cookie
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET || JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN || "7d",
  })
}

// Issues both tokens: access token returned in body, refresh token set as cookie
export const generateTokenPair = (res, userId) => {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  return { accessToken, refreshToken }
}
