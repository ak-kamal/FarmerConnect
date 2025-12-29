import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");

    const name = "Admin";
    const email = "abdulkariem.bin.kamal@g.bracu.ac.bd"; // change
    const password = "12345678";          // change

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      isVerified: true,
      adminStatus: "approved",
      adminReviewedAt: new Date(),
    });

    console.log("Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
