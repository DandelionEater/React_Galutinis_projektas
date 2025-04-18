import express, { Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import animeRoutes from "./routes/animeRoutes";
import anilistRoutes from "./routes/anilistRoutes";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

/// <reference path="../types/express.d.ts" />

import path from "path";
import CustomRequest from "types/express";
dotenv.config({ path: path.resolve(__dirname, "../anime_tracker.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/anime_tracker")
  .then(() => {
    console.log("Prisijungta prie MongoDB!");
  })
  .catch((err) => {
    console.error("Nepavyko prisijungti prie MongoDB:", err);
  });

app.use("/api/animes", animeRoutes);
app.use("/api/anilist", anilistRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/protected", authMiddleware, (req: CustomRequest, res: Response) => {
  res.json({ message: "🔐 Protected route pasiektas", user: req.user });
});

app.get("/", (req, res) => {
  res.send("🎉 Backend su MongoDB veikia!");
});

app.listen(PORT, () => {
  console.log(`✅ Serveris veikia: http://localhost:${PORT}`);
});
