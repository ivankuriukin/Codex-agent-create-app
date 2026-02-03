import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import type { Request, Response } from "express";
import { FRONTEND_ORIGIN, PORT } from "./config/env.js";
import { resolvers } from "./graphql/schema.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { authMiddleware, issueTokens, setAuthCookies, toAuthUser, readAccessUserId } from "./auth/service.js";
import { prisma } from "./db/prisma.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "fs";
import path from "path";

export async function startServer() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })
  );
  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${baseName}${ext}`);
    },
  });
  const upload = multer({ storage });

  app.post("/auth/register", async (req: Request, res: Response) => {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name ?? null, passwordHash },
    });

    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({ user: toAuthUser(user) });
  });

  app.post("/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const { accessToken, refreshToken } = await issueTokens(user.id);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({ user: toAuthUser(user) });
  });

  app.post("/profile", async (req: Request, res: Response) => {
    const userId = readAccessUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { firstName, lastName, middleName, description, birthDate } = req.body as {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      description?: string;
      birthDate?: string;
    };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        middleName: middleName ?? null,
        description: description ?? null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    return res.status(200).json({ user: toAuthUser(updated) });
  });

  app.post("/profile/photo", upload.single("photo"), async (req: Request, res: Response) => {
    const userId = readAccessUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Photo is required." });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { photoUrl },
    });

    return res.status(200).json({ user: toAuthUser(updated) });
  });

  app.delete("/profile/photo", async (req: Request, res: Response) => {
    const userId = readAccessUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null },
    });

    return res.status(200).json({ user: toAuthUser(updated) });
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req: req as Request,
        res: res as Response,
        user: await authMiddleware(req as Request),
      }),
    })
  );

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}
