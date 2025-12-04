const mongoose = require('mongoose');

/**
 * @desc Connects the application to the MongoDB database using Mongoose.
 * The MONGO_URI is retrieved from the environment variables (loaded via dotenv).
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Note: The 'colors' package (for .cyan.underline.bold) is common in MERN projects
    // but requires 'require('colors')' in the server entry file (server.js) to function.

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.bold);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;