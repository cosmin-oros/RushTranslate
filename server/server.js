require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS middleware
const translationRoutes = require("./routes/translationRoutes");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Supabase is initialized in translationControllers
console.log("Server initialized");

// API routes
app.use("/api/translations", translationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
