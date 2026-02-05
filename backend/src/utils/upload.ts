import fs from "fs";
import path from "path";
import multer from "multer";

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

export const upload = multer({ storage });
