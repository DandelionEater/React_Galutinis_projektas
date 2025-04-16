import express, { Request, Response } from 'express';
import AniList from '../service/anilist';

const router = express.Router();
const anilist = new AniList();

router.get("/search/:query/:page", async (req: Request<{query: string, page: number}>, res: Response) => {
  try {
    const animeList = await anilist.searchAnime(req.params.page, req.params.query)
    console.log(animeList);
    res.status(200).json({ response: animeList });
  } catch (error) {
    res.status(400).json({ message: "Klaida gaunant anime", error });
  }
});

router.get("/get/:id", async (req: Request<{id: number}>, res) => {
  try {
    const anime = await anilist.getAnime(req.params.id);
    console.log(anime);
    res.status(200).json({ response: anime });
  } catch (error) {
    res.status(400).json({ message: "Klaida gaunant anime", error });
  }
})

export default router;
