import express, { Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import animeRoutes from "./routes/animeRoutes";
import anilistRoutes from "./routes/anilistRoutes";
import authRoutes from "./routes/authRoutes"; // 👈 nauja
import { authMiddleware } from "./middleware/authMiddleware"; // 👈 jei naudosi apsaugotus maršrutus

/// <reference path="../types/express.d.ts" />

// Įkeliam .env failą
import path from "path";
import CustomRequest from "types/express";
dotenv.config({ path: path.resolve(__dirname, "../anime_tracker.env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Prisijungimas prie MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/anime_tracker")
  .then(() => {
    console.log("✅ Prisijungta prie MongoDB!");
  })
  .catch((err) => {
    console.error("❌ Nepavyko prisijungti prie MongoDB:", err);
  });

// Maršrutai
app.use("/api/animes", animeRoutes);
app.use("/api/anilist", anilistRoutes);
app.use("/api/auth", authRoutes); // 👈 pridėta autentifikacijos maršrutams

// Testinis apsaugotas route (nebūtinas dabar, bet parodymui)
app.get("/api/protected", authMiddleware, (req: CustomRequest, res: Response) => {
  res.json({ message: "🔐 Protected route pasiektas", user: req.user });
});

// Pradinis GET route
app.get("/", (req, res) => {
  res.send("🎉 Backend su MongoDB veikia!");
});

// Paleidžiam serverį
app.listen(PORT, () => {
  console.log(`✅ Serveris veikia: http://localhost:${PORT}`);
});
