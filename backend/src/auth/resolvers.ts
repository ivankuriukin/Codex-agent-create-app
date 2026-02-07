import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { prisma } from "../db/prisma.js";
import { redisClient } from "../db/redis.js";
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
      const refreshKey = `auth:refresh:${userId}`;
      await redisClient.del(refreshKey);
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
        birthDate: args.input.birthDate ? new Date(args.input.birthDate) : null,
      },
    });

    return { user: toAuthUser(updated) };
  },
  uploadProfilePhoto: async (
    _: unknown,
    args: {
      input: {
        fileName: string;
        base64: string;
      };
    },
    context: { user: { id: string } | null }
  ) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(args.input.fileName);
    const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${baseName}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const base64Data = args.input.base64.includes(",")
      ? args.input.base64.split(",")[1]!
      : args.input.base64;

    await fs.promises.writeFile(filePath, Buffer.from(base64Data, "base64"));

    const photoUrl = `/uploads/${fileName}`;
    const updated = await prisma.user.update({
      where: { id: context.user.id },
      data: { photoUrl },
    });

    return { user: toAuthUser(updated) };
  },
  deleteProfilePhoto: async (
    _: unknown,
    __: unknown,
    context: { user: { id: string } | null }
  ) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const updated = await prisma.user.update({
      where: { id: context.user.id },
      data: { photoUrl: null },
    });

    return { user: toAuthUser(updated) };
  },
};
