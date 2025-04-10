import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import animeRoutes from "./routes/animeRoutes";

// Įkeliam .env failą
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Prisijungimas prie MongoDB naudojant Mongoose su atnaujintais parametrais
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/anime_tracker")
  .then(() => {
    console.log("✅ Prisijungta prie MongoDB!");
  })
  .catch((err) => {
    console.error("❌ Nepavyko prisijungti prie MongoDB:", err);
  });

// Naudojame anime maršrutus
app.use("/api/animes", animeRoutes);

// Pagrindinis GET route
app.get("/", (req, res) => {
  res.send("🎉 Backend su MongoDB veikia!");
});

// Klausomės serverio
app.listen(PORT, () => {
  console.log(`✅ Serveris veikia: http://localhost:${PORT}`);
});
