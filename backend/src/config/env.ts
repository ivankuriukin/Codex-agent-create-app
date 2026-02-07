import "dotenv/config";

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || "7d";
const IS_PROD = process.env.NODE_ENV === "production";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not set. Define JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.");
}

export {
  PORT,
  FRONTEND_ORIGIN,
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TTL,
  REFRESH_TTL,
  IS_PROD,
  TELEGRAM_BOT_TOKEN,
  REDIS_URL,
};
