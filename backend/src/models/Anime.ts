import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  episodes: { type: Number, required: true },
  rating: { type: Number, required: true }
});

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;
