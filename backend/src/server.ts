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
import { authMiddleware } from "./auth/service.js";
import { authRouter } from "./routes/auth.routes.js";
import { profileRouter } from "./routes/profile.routes.js";
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
  app.use(express.json({ limit: "10mb" }));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use("/auth", authRouter);
  app.use("/profile", profileRouter);

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
