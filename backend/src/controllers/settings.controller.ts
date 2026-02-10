import type { Request, Response } from 'express';
import { ThemeMode } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { readAccessUserId } from '../auth/service.js';

const allowedThemes = new Set(['light', 'dark']);

export async function getSettings(req: Request, res: Response) {
  const userId = readAccessUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existing = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (existing) {
    return res.status(200).json({ settings: existing });
  }

  const created = await prisma.userSettings.create({
    data: { userId, theme: 'light' },
  });

  return res.status(200).json({ settings: created });
}

export async function updateSettings(req: Request, res: Response) {
  const userId = readAccessUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { theme } = req.body as { theme?: string };
  if (!theme) {
    return res.status(400).json({ error: 'Theme is required.' });
  }
  if (!allowedThemes.has(theme)) {
    return res.status(400).json({ error: 'Invalid theme value.' });
  }

  const themeValue = theme as ThemeMode;

  const updated = await prisma.userSettings.upsert({
    where: { userId },
    update: {
      theme: themeValue,
    },
    create: {
      userId,
      theme: themeValue,
    },
  });

  return res.status(200).json({ settings: updated });
}
