import { jest } from "@jest/globals";

type User = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FindUniqueArgs = { where: { id?: string; email?: string } };
type CreateArgs = { data: { email: string; name?: string | null; passwordHash: string } };
type UpdateArgs = { where: { id: string }; data: Partial<Pick<User, "refreshTokenHash">> };

let userIdCounter = 1;
export const users = new Map<string, User>();

export const prismaMock = {
  user: {
    findUnique: jest.fn(async ({ where }: FindUniqueArgs) => {
      if (where.id) {
        return users.get(where.id) ?? null;
      }
      if (where.email) {
        for (const user of users.values()) {
          if (user.email === where.email) return user;
        }
      }
      return null;
    }),
    create: jest.fn(async ({ data }: CreateArgs) => {
      const id = `user_${userIdCounter++}`;
      const now = new Date();
      const user: User = {
        id,
        email: data.email,
        name: data.name ?? null,
        passwordHash: data.passwordHash,
        refreshTokenHash: null,
        createdAt: now,
        updatedAt: now,
      };
      users.set(id, user);
      return user;
    }),
    update: jest.fn(async ({ where, data }: UpdateArgs) => {
      const user = users.get(where.id);
      if (!user) {
        throw new Error("User not found");
      }
      Object.assign(user, data, { updatedAt: new Date() });
      users.set(where.id, user);
      return user;
    }),
  },
};

export const prisma = prismaMock;

export function resetPrismaMock() {
  users.clear();
  userIdCounter = 1;
  prismaMock.user.findUnique.mockClear();
  prismaMock.user.create.mockClear();
  prismaMock.user.update.mockClear();
}
