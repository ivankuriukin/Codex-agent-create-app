import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TTL,
  REFRESH_TTL,
  IS_PROD,
} from '../config/env.js';
import type { JwtPayload } from './types.js';

export function signAccessToken(userId: string) {
  const options: SignOptions = {
    expiresIn: ACCESS_TTL as SignOptions['expiresIn'],
  };
  return jwt.sign({ sub: userId } satisfies JwtPayload, ACCESS_SECRET, options);
}

export function signRefreshToken(userId: string) {
  const options: SignOptions = {
    expiresIn: REFRESH_TTL as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { sub: userId } satisfies JwtPayload,
    REFRESH_SECRET,
    options,
  );
}

export function cookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: IS_PROD,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function getTtlMs(value: string, fallbackMs: number) {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return fallbackMs;
  const amount = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return fallbackMs;
  }
}
