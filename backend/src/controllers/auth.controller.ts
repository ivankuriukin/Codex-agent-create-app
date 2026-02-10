import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { issueTokens, setAuthCookies, toAuthUser } from '../auth/service.js';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name: name ?? null, passwordHash },
  });

  const { accessToken, refreshToken } = await issueTokens(user.id);
  setAuthCookies(res, accessToken, refreshToken);

  return res.status(201).json({ user: toAuthUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const { accessToken, refreshToken } = await issueTokens(user.id);
  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({ user: toAuthUser(user) });
}
