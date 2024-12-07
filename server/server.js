require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS middleware
const translationRoutes = require("./routes/translationRoutes");

const app = express();

// Enable CORS for all routes with better configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", // Use environment variable for allowed origins
  methods: "GET,POST,PUT,DELETE", // Allow only necessary HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
  credentials: true, // Include cookies if needed for client-side
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(bodyParser.json());

// Supabase is initialized in translationControllers
console.log("Server initialized");

// API routes
app.use("/api/translations", translationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
