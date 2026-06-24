require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected! ✅"))
  .catch(err => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));