import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { readAccessUserId, toAuthUser } from "../auth/service.js";

export async function updateProfile(req: Request, res: Response) {
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
}

export async function uploadPhoto(req: Request, res: Response) {
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
}

export async function deletePhoto(req: Request, res: Response) {
  const userId = readAccessUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { photoUrl: null },
  });

  return res.status(200).json({ user: toAuthUser(updated) });
}
