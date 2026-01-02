// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import songRoutes from "./routes/SongRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// // middleware to read JSON body
// app.use(express.json());

// // routes
// app.use("/api/songs", songRoutes);

// const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("MusicPlayer backend is running 🎶");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// app.get("/test", (req, res) => {
//   res.send("Test route works");
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

// ROUTES
import songRoutes from "./routes/SongRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// CONFIG
dotenv.config();

const app = express();

/* ------------------ MIDDLEWARE ------------------ */

// Allow frontend (Vite)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Serve uploaded songs
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ------------------ ROUTES ------------------ */

app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🎵 Music Player API running");
});

/* ------------------ DATABASE ------------------ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

/* ------------------ SERVER ------------------ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

