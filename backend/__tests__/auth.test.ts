import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { authResolvers } from "../src/auth/resolvers.js";
import { issueTokens, verifyRefreshToken } from "../src/auth/service.js";
import { signAccessToken, signRefreshToken } from "../src/auth/tokens.js";
import { prismaMock, users, resetPrismaMock, type User } from "./mocks/prisma";

type CookieResponse = {
  cookie: jest.Mock;
};

type ClearCookieResponse = {
  clearCookie: jest.Mock;
};

type AuthRequest = {
  cookies: Record<string, string>;
};

function asRequest(req: AuthRequest) {
  return req as unknown as Request;
}

function asCookieResponse(res: CookieResponse) {
  return res as unknown as Response;
}

function asClearCookieResponse(res: ClearCookieResponse) {
  return res as unknown as Response;
}

describe("auth", () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  test("issueTokens hashes and stores refresh token", async () => {
    const passwordHash = await bcrypt.hash("pass", 10);
    const user = await prismaMock.user.create({
      data: { email: "a@b.com", passwordHash },
    });

    const { refreshToken } = await issueTokens(user.id);
    const stored = users.get(user.id) as User | undefined;

    expect(stored).toBeDefined();
    expect(stored?.refreshTokenHash).toBeTruthy();
    const matches = await bcrypt.compare(refreshToken, stored!.refreshTokenHash as string);
    expect(matches).toBe(true);
  });

  test("register creates user and sets cookies", async () => {
    const res: CookieResponse = { cookie: jest.fn() };
    const result = await authResolvers.register(
      null,
      { email: "new@demo.com", password: "demo", name: "New" },
      { res: asCookieResponse(res) }
    );

    expect(result.user.email).toBe("new@demo.com");
    expect(res.cookie).toHaveBeenCalledWith(
      "access_token",
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refresh_token",
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
  });

  test("login sets cookies for valid credentials", async () => {
    const passwordHash = await bcrypt.hash("demo", 10);
    await prismaMock.user.create({
      data: { email: "demo@demo.com", passwordHash },
    });

    const res: CookieResponse = { cookie: jest.fn() };
    const result = await authResolvers.login(
      null,
      { email: "demo@demo.com", password: "demo" },
      { res: asCookieResponse(res) }
    );

    expect(result.user.email).toBe("demo@demo.com");
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  test("refresh validates refresh token and issues new cookies", async () => {
    const passwordHash = await bcrypt.hash("demo", 10);
    const user = await prismaMock.user.create({
      data: { email: "demo@demo.com", passwordHash },
    });

    const refreshToken = signRefreshToken(user.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await prismaMock.user.update({ where: { id: user.id }, data: { refreshTokenHash } });

    const req: AuthRequest = { cookies: { refresh_token: refreshToken } };
    const res: CookieResponse = { cookie: jest.fn() };
    const result = await authResolvers.refresh(null, null, {
      req: asRequest(req),
      res: asCookieResponse(res),
    });

    expect(result.user.email).toBe("demo@demo.com");
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  test("logout clears cookies and resets refresh token hash", async () => {
    const passwordHash = await bcrypt.hash("demo", 10);
    const user = await prismaMock.user.create({
      data: { email: "demo@demo.com", passwordHash },
    });

    const accessToken = signAccessToken(user.id);
    const req: AuthRequest = { cookies: { access_token: accessToken } };
    const res: ClearCookieResponse = { clearCookie: jest.fn() };

    const result = await authResolvers.logout(null, null, {
      req: asRequest(req),
      res: asClearCookieResponse(res),
    });
    const updated = users.get(user.id) as User | undefined;

    expect(result).toBe(true);
    expect(updated).toBeDefined();
    expect(updated!.refreshTokenHash).toBeNull();
    expect(res.clearCookie).toHaveBeenCalledWith("access_token", { path: "/" });
    expect(res.clearCookie).toHaveBeenCalledWith("refresh_token", { path: "/" });
  });

  test("verifyRefreshToken throws for invalid token", async () => {
    await expect(verifyRefreshToken("bad")).rejects.toThrow("Invalid refresh token.");
  });
});
