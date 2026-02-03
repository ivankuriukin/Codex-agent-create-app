import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";
import {
  issueTokens,
  setAuthCookies,
  clearAuthCookies,
  toAuthUser,
  verifyRefreshToken,
  readAccessUserId,
} from "./service.js";

export const authResolvers = {
  register: async (
    _: unknown,
    args: { email: string; password: string; name?: string | null },
    context: { res: Response }
  ) => {
    const { email, password, name } = args;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("User already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name ?? null, passwordHash },
    });

    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(context.res, accessToken, refreshToken);

    return { user: toAuthUser(user) };
  },
  login: async (
    _: unknown,
    args: { email: string; password: string },
    context: { res: Response }
  ) => {
    const { email, password } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new Error("Invalid credentials.");
    }

    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(context.res, accessToken, refreshToken);

    return { user: toAuthUser(user) };
  },
  refresh: async (_: unknown, __: unknown, context: { req: Request; res: Response }) => {
    const token = context.req.cookies.refresh_token as string | undefined;
    if (!token) {
      throw new Error("Refresh token missing.");
    }

    const user = await verifyRefreshToken(token);
    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(context.res, accessToken, refreshToken);

    return { user: toAuthUser(user) };
  },
  logout: async (_: unknown, __: unknown, context: { req: Request; res: Response }) => {
    const userId = readAccessUserId(context.req);
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
    }

    clearAuthCookies(context.res);
    return true;
  },
  updateProfile: async (
    _: unknown,
    args: {
      input: {
        firstName?: string | null;
        lastName?: string | null;
        middleName?: string | null;
        description?: string | null;
        photoUrl?: string | null;
        birthDate?: string | null;
      };
    },
    context: { user: { id: string } | null }
  ) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const updated = await prisma.user.update({
      where: { id: context.user.id },
      data: {
        firstName: args.input.firstName ?? null,
        lastName: args.input.lastName ?? null,
        middleName: args.input.middleName ?? null,
        description: args.input.description ?? null,
        photoUrl: args.input.photoUrl ?? null,
        birthDate: args.input.birthDate ? new Date(args.input.birthDate) : null,
      },
    });

    return { user: toAuthUser(updated) };
  },
};
