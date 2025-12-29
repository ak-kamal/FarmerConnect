import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Expect TWO files: nidFront and nidBack
export const uploadNidImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB each
}).fields([
  { name: "nidFront", maxCount: 1 },
  { name: "nidBack", maxCount: 1 },
]);
