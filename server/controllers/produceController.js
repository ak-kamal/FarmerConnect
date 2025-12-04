import Produce from '../models/Produce.js';
import path from 'path'; 
import fs from 'fs'; 
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create the 'uploads/produce' folder if it doesn't exist
        // Note: The 'uploads' folder is relative to the root of the server directory.
        const uploadPath = path.join(path.resolve(), 'uploads', 'produce');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create a unique filename (e.g., image-1678888888-987654.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// 2. Filter file types
const fileFilter = (req, file, cb) => {
    // Check if file is an image (jpeg, png, etc.)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Reject file and return an error
        cb(new Error('Only image files are allowed!'), false);
    }
};

// 3. Initialize multer middleware (exported for use in farmerRoutes.js)
export const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('image'); 
// The .single('image') part MUST match the name="image" attribute in the React form.

// --- Controller Function (FR-5 Core Logic) ---

// This function executes after all middlewares (protect, farmerOnly, uploadImage)
export const createProduce = async (req, res) => {
    // Text data comes from req.body (handled by Multer for multipart form)
    const { 
        produceName, category, quantity, region, 
        pricePerUnit, qualityGrade, description, harvestDate 
    } = req.body;

    // The farmer's ID is attached via the 'protect' middleware from req.user
    if (!req.user || req.user.role !== 'farmer') {
        // This is a safety check; 'farmerOnly' middleware should have caught this.
        if (req.file) { fs.unlinkSync(req.file.path); } 
        return res.status(403).json({ message: 'Access Denied. Must be a farmer.' });
    }
    
    // --- Mongoose Save Operation ---
    try {
        const newProduce = await Produce.create({
            // Link to the Farmer
            farmer: req.user._id, 
            
            // Text/Number fields
            produceName, category, quantity, region, pricePerUnit, qualityGrade, description, harvestDate,
            
            // Image Path (saved by Multer)
            images: req.file ? [ `/uploads/produce/${req.file.filename}` ] : [], 
        });

        res.status(201).json({
            success: true,
            message: 'Produce details uploaded successfully!',
            data: newProduce,
        });

    } catch (error) {
        // If the database operation fails (e.g., Mongoose validation), delete the uploaded file
        if (req.file) { fs.unlinkSync(req.file.path); }
        console.error("Produce creation error:", error);
        
        // Respond with a detailed validation error if available
        let message = 'Server error during produce upload.';
        if (error.name === 'ValidationError') {
             message = Object.values(error.errors).map(val => val.message).join('; ');
        }
        res.status(400).json({ message: message });
    }
};