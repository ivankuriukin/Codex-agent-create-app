import { describe, expect, test, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { createServer } from "http";
import type { Server } from "http";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { issueTokens, setAuthCookies, toAuthUser } from "../src/auth/service.js";
import { prismaMock, resetPrismaMock, users } from "./mocks/prisma";
import { resetRedisMock } from "./mocks/redis";

let server: Server;

beforeAll(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());

  app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existing = await prismaMock.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prismaMock.user.create({
      data: { email, name: name ?? null, passwordHash },
    });

    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({ user: toAuthUser(user) });
  });

  server = createServer(app);
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  resetPrismaMock();
  resetRedisMock();
});

test("POST /auth/register creates a user and sets cookies", async () => {
  const response = await request(server)
    .post("/auth/register")
    .send({ email: "new-user@example.test", password: "demo", name: "New" });

  expect(response.status).toBe(201);
  expect(response.body.user.email).toBe("new-user@example.test");
  expect(response.headers["set-cookie"]).toBeDefined();
  expect(users.size).toBe(1);
});
