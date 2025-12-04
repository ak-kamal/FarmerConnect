import express from "express";
import dotenv from "dotenv";
import path from 'path'; 
import connectDB from "./config/db.js"; 
import farmerRoutes from "./routes/farmerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'))); 
//[Image of Express middleware stack showing a request flowing through static file middleware]

app.use("/api/auth", userRoutes); 

app.use("/api/farmer", farmerRoutes); 
connectDB().then(() => {
 
  app.listen(PORT, () => {
    console.log("SERVER started on port :", PORT);
    console.log(`Access server at http://localhost:${PORT}`);
  });

}).catch(error => {
    console.error("Failed to connect to the database. Exiting:", error);
    process.exit(1);
});