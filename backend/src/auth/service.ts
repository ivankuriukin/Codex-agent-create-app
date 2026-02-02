import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { ACCESS_SECRET, REFRESH_SECRET, ACCESS_TTL, REFRESH_TTL } from "../config/env.js";
import type { AuthUser, JwtPayload } from "./types.js";
import { cookieOptions, getTtlMs, signAccessToken, signRefreshToken } from "./tokens.js";

export function toAuthUser(user: { id: string; email: string; name: string | null; createdAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  } satisfies AuthUser;
}

export async function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  });

  return { accessToken, refreshToken };
}

export function readAccessUserId(req: Request) {
  const token = req.cookies.access_token as string | undefined;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    return payload.sub;
  } catch {
    return null;
  }
}

export async function authMiddleware(req: Request) {
  const userId = readAccessUserId(req);
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return toAuthUser(user);
}

export function getAccessCookieMaxAge() {
  return getTtlMs(ACCESS_TTL, 15 * 60 * 1000);
}

export function getRefreshCookieMaxAge() {
  return getTtlMs(REFRESH_TTL, 7 * 24 * 60 * 60 * 1000);
}

export function setAuthCookies(
  res: Pick<Response, "cookie">,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("access_token", accessToken, cookieOptions(getAccessCookieMaxAge()));
  res.cookie("refresh_token", refreshToken, cookieOptions(getRefreshCookieMaxAge()));
}

export function clearAuthCookies(res: Pick<Response, "clearCookie">) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
}

export async function verifyRefreshToken(token: string) {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new Error("Invalid refresh token.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.refreshTokenHash) {
    throw new Error("Refresh token invalid.");
  }

  const matches = await bcrypt.compare(token, user.refreshTokenHash);
  if (!matches) {
    throw new Error("Refresh token invalid.");
  }

  return user;
}
