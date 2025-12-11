import Produce from "../models/Produce.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

// If you ever need __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "produce");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// 2. Filter file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// 3. Multer middleware
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");

// 4. Controller
export const createProduce = async (req, res) => {
  const {
    produceName,
    category,
    quantity,
    region,
    pricePerUnit,
    qualityGrade,
    description,
    harvestDate,
  } = req.body;

  if (!req.user || req.user.role !== "farmer") {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }
    return res
      .status(403)
      .json({ message: "Access Denied. Must be a farmer." });
  }

  try {
    const newProduce = await Produce.create({
      farmerId: req.user._id,
      produceName,
      category,
      quantity,
      region,
      pricePerUnit,
      qualityGrade,
      description,
      harvestDate,
      images: req.file ? [`/uploads/produce/${req.file.filename}`] : [],
    });

    return res.status(201).json({
      success: true,
      message: "Produce details uploaded successfully!",
      data: newProduce,
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }

    console.error("Produce creation error:", error);

    let message = "Server error during produce upload.";
    if (error.name === "ValidationError") {
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join("; ");
    }

    return res.status(400).json({ message });
  }
};

// Controller to get all produce items for the authenticated farmer
export const getMyProduce = async (req, res) => {
  // Must be authenticated farmer
  if (!req.user || req.user.role !== "farmer") {
    return res
      .status(403)
      .json({ message: "Access denied. Only farmers can view this list." });
  }

  try {
    const produces = await Produce.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      data: produces,
    });
  } catch (error) {
    console.error("Error fetching farmer produce:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch produce. Please try again later." });
  }
};