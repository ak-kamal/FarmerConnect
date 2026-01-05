//import dotenv from "dotenv";
//dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wholesalerRoutes from "./routes/wholesalerRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wholesalerOrderRoutes from "./routes/wholesalerOrderRoutes.js";
import wholesalerTransportRoutes from "./routes/wholesalerTransportRoutes.js";
import transportRequestRoutes from "./routes/transportRequestRoutes.js";

const app = express();

// If you need __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
// API routes
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }), webhookRoutes
);

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wholesaler", wholesalerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wholesaler", wholesalerOrderRoutes);
app.use("/api/wholesaler/transports", wholesalerTransportRoutes);
app.use("/api/transport-requests", transportRequestRoutes);

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/farmer_connect";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
