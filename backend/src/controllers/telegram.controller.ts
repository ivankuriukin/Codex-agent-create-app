import type { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { FRONTEND_ORIGIN, TELEGRAM_BOT_TOKEN } from '../config/env.js';
import {
  issueTokens,
  readAccessUserId,
  setAuthCookies,
} from '../auth/service.js';

export async function telegramCallback(req: Request, res: Response) {
  if (!TELEGRAM_BOT_TOKEN) {
    return res
      .status(500)
      .json({ error: 'Telegram bot token is not configured.' });
  }

  const redirectParam =
    typeof req.query.redirect === 'string' ? req.query.redirect : '/';
  const redirectPath = redirectParam.startsWith('/') ? redirectParam : '/';

  const query = Object.fromEntries(
    Object.entries(req.query).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value[0]
        : typeof value === 'string'
          ? value
          : undefined,
    ]),
  ) as Record<string, string | undefined>;
  const { hash, ...payload } = query;
  if (!hash) {
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  const dataCheckString = Object.keys(payload)
    .filter((key) => payload[key] !== undefined)
    .sort()
    .map((key) => `${key}=${payload[key]}`)
    .join('\n');

  const secretKey = crypto
    .createHash('sha256')
    .update(TELEGRAM_BOT_TOKEN)
    .digest();
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) {
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  const authDateValue = payload.auth_date ? Number(payload.auth_date) : 0;
  if (!authDateValue || Date.now() / 1000 - authDateValue > 86400) {
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  const telegramId = payload.id;
  if (!telegramId) {
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  const currentUserId = readAccessUserId(req);
  const existingByTelegram = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (currentUserId) {
    if (existingByTelegram && existingByTelegram.id !== currentUserId) {
      return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
    }

    const updated = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        telegramId,
        telegramUsername: payload.username ?? null,
        telegramPhotoUrl: payload.photo_url ?? null,
        telegramAuthDate: new Date(authDateValue * 1000),
        firstName: payload.first_name ?? undefined,
        lastName: payload.last_name ?? undefined,
      },
    });

    const { accessToken, refreshToken } = await issueTokens(updated.id);
    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  if (existingByTelegram) {
    const { accessToken, refreshToken } = await issueTokens(
      existingByTelegram.id,
    );
    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
  }

  const email = `tg_${telegramId}@telegram.local`;
  const name =
    [payload.first_name, payload.last_name].filter(Boolean).join(' ').trim() ||
    null;
  const user = await prisma.user.create({
    data: {
      email,
      name,
      firstName: payload.first_name ?? null,
      lastName: payload.last_name ?? null,
      telegramId,
      telegramUsername: payload.username ?? null,
      telegramPhotoUrl: payload.photo_url ?? null,
      telegramAuthDate: new Date(authDateValue * 1000),
      passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
    },
  });

  const { accessToken, refreshToken } = await issueTokens(user.id);
  setAuthCookies(res, accessToken, refreshToken);
  return res.redirect(`${FRONTEND_ORIGIN}${redirectPath}`);
}
