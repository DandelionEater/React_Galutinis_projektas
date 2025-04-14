import express, { Request, Response, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import Anime from '../models/Anime';

const router = express.Router();

// Create (C) - Sukurti naują anime
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const newAnime = new Anime(req.body);
    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(400).json({ message: "Klaida kuriant anime", error });
  }
});

// Read (R) - Gauti visus anime
router.get("/", async (req: Request, res: Response) => {
  try {
    const animes = await Anime.find();
    res.status(200).json(animes);
  } catch (error) {
    res.status(400).json({ message: "Klaida gaunant anime", error });
  }
});

// Update (U) - Atnaujinti anime pagal ID
router.put("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAnime) return res.status(404).json({ message: "Anime nerasta" });
    res.status(200).json(updatedAnime);
  } catch (error) {
    res.status(400).json({ message: "Klaida atnaujinant anime", error });
  }
});

// Delete (D) - Pašalinti anime pagal ID
router.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
    if (!deletedAnime) return res.status(404).json({ message: "Anime nerasta" });
    res.status(200).json({ message: "Anime pašalinta" });
  } catch (error) {
    res.status(400).json({ message: "Klaida pašalinant anime", error });
  }
});

export default router;
