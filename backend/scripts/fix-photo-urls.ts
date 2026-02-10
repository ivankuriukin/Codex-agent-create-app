import fs from 'fs';
import path from 'path';
import { prisma } from '../src/db/prisma.js';

const uploadsDir = path.join(process.cwd(), 'uploads');
const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function fileExists(p: string) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

async function run() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory, skipping.');
    return;
  }

  const users = await prisma.user.findMany({
    where: { photoUrl: { not: null } },
    select: { id: true, photoUrl: true },
  });

  let updated = 0;
  for (const user of users) {
    const photoUrl = user.photoUrl ?? '';
    if (!photoUrl.startsWith('/uploads/')) continue;

    const fileName = photoUrl.replace('/uploads/', '');
    const currentPath = path.join(uploadsDir, fileName);
    if (fileExists(currentPath)) continue;

    if (path.extname(fileName)) continue;

    let nextUrl: string | null = null;
    for (const ext of exts) {
      const candidate = `${currentPath}${ext}`;
      if (fileExists(candidate)) {
        nextUrl = `/uploads/${fileName}${ext}`;
        break;
      }
    }

    if (nextUrl) {
      await prisma.user.update({
        where: { id: user.id },
        data: { photoUrl: nextUrl },
      });
      updated += 1;
    }
  }

  console.log(`Updated ${updated} user(s).`);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
