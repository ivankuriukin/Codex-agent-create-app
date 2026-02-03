import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const email = "demo@demo.com";
  const password = "demo";
  const name = "Demo";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, name, passwordHash },
  });

  console.log("User created");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
