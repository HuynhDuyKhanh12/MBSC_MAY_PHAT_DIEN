import multer from "multer";
import fs from "fs";
import path from "path";

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createStorage = (folder: string) => {
  const uploadDir = path.join(process.cwd(), "uploads", folder);
  ensureDir(uploadDir);

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");

      cb(null, `${Date.now()}-${baseName}${ext}`);
    },
  });
};

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Chỉ cho phép upload file ảnh"));
};

export const uploadBrandImage = multer({
  storage: createStorage("brands"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCategoryImage = multer({
  storage: createStorage("categories"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadUserImage = multer({
  storage: createStorage("users"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductImage = multer({
  storage: createStorage("products"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});