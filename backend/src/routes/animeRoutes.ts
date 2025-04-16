import express, { Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import User, { Anime } from "../models/User";
import CustomRequest from 'types/express';

const router = express.Router();

// Create (C) - Sukurti naują anime
router.post("/", authMiddleware, async (req: CustomRequest, res: Response) => {
  try {
    const { anime } = req.body;

    const user = req.user;

    const updated = await User.findByIdAndUpdate(user._id, { $addToSet: { animeList: anime }}, { new: true });

    res.status(201).json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Klaida kuriant anime", error });
  }
});

// Read (R) - Gauti visus anime
router.get("/", authMiddleware, async (req: CustomRequest, res: Response) => {
  try {
    res.status(200).json(req.user.animeList);
  } catch (error) {
    res.status(400).json({ message: "Klaida gaunant anime", error });
  }
});

router.get("/:id", authMiddleware, async (req: CustomRequest<{id: string}>, res: Response) => {
  try {
    res.status(200).json(req.user.animeList[req.params.id]);
  } catch (error) {
    res.status(400).json({ message: "Klaida gaunant anime", error });
  }
})

// Update (U) - Atnaujinti anime pagal ID
router.put("/:id", authMiddleware, async (req: CustomRequest<{ id: string }>, res: Response) => {
  try {
    const { anime } = req.body;

    console.log(anime);

    const setFields: any = {};
    for (const key in anime) {
      if (anime[key] !== undefined) {
        setFields[`animeList.${req.params.id}.${key}`] = anime[key];
      }
    }

    res.status(200).json((await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: setFields
      },
      {
        new: true
      }
    ))?.animeList);
  } catch (error) {
    res.status(400).json({ message: "Klaida atnaujinant anime", error });
  }
});

// Delete (D) - Pašalinti anime pagal ID
router.delete("/:id", authMiddleware, async (req: CustomRequest<{ id: string }>, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { [`animeList.${req.params.id}`]: 1 }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { animeList: null }
    });

    res.status(200).json({ message: "Anime pašalinta" });
  } catch (error) {
    res.status(400).json({ message: "Klaida pašalinant anime", error });
  }
});

export default router;
