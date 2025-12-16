import Produce from "../models/Produce.js";
import multer from "multer";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";

// If you ever need __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// 1. Configure storage
const storage = multer.memoryStorage();

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

const uploadBufferToCloudinary = (buffer, folder = "farmer-connect/produce") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

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
    return res.status(403).json({ message: "Access Denied. Must be a farmer." });
  }
console.log("=== FR-5 CREATE PRODUCE DEBUG ===");
console.log("req.user:", req.user?._id, req.user?.role);
console.log("req.body:", req.body);
console.log("req.file:", req.file ? { mimetype: req.file.mimetype, size: req.file.size, hasBuffer: !!req.file.buffer } : null);


  try {
    let imageUrl = null;

    // If farmer uploaded an image, upload it to Cloudinary
    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url; // HTTPS URL
    }

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
      images: imageUrl ? [imageUrl] : [],
    });

    return res.status(201).json({
      success: true,
      message: "Produce details uploaded successfully!",
      data: newProduce,
    });
  } catch (error) {
    //console.error("Produce creation error:", error);
    console.error("Produce creation error FULL:", error);


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