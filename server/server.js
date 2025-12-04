// 1. Load Environment Variables from .env file FIRST
const dotenv = require('dotenv').config();

// 2. Import Database Connection and Core Libraries
const express = require('express');
const colors = require('colors'); // Required for console output styling in db.js
const connectDB = require('./config/db'); // Import the function from the Canvas

// 3. Connect to MongoDB
connectDB();

// 4. Initialize Express
const app = express();

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// 5. Middleware Setup
// Body parser for raw JSON data
app.use(express.json());
// Body parser for form data (URL-encoded)
app.use(express.urlencoded({ extended: false }));

// 6. Route Definitions
// ====================================================================
// FR-1 & FR-2/FR-3 Routes: Authentication (Signup, Login, Logout)
// We wire up the authRoutes file here, making the endpoints: /api/users/signup, etc.
app.use('/api/users', require('./routes/authRoutes'));

// FR-5 Routes: Farmer Actions (Placeholder for produce upload)
// This assumes the FR-5 developer names their route file farmerRoutes.js
//app.use('/api/farmer', require('./routes/farmerRoutes')); 
// You must ensure server/routes/farmerRoutes.js exists, even if it's empty for now.
// ====================================================================


// 7. Simple Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Farmer Connect API is running.' });
});

// 8. Start the Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});