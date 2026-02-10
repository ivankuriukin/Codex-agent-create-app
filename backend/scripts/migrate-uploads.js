import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('No uploads directory, skipping.');
  process.exit(0);
}

const mimeToExt = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const files = fs.readdirSync(uploadsDir);
let migrated = 0;
for (const file of files) {
  const full = path.join(uploadsDir, file);
  const stat = fs.statSync(full);
  if (!stat.isFile()) continue;
  if (path.extname(file)) continue;

  let mime = '';
  try {
    mime = execSync(`file --mime-type -b "${full}"`).toString().trim();
  } catch {
    continue;
  }
  const ext = mimeToExt[mime];
  if (!ext) continue;

  const next = `${full}${ext}`;
  fs.renameSync(full, next);
  migrated += 1;
}

console.log(`Migrated ${migrated} file(s).`);
