import { Response, NextFunction } from "express";
import CustomRequest from "../types/express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const auth = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string,
      iat: number,
      exp: number
    };

    console.log(auth);

    const user = await User.findById(auth.id).lean();

    req.user = user;
    next();
  } catch (err) {

    return res.status(400).json({ message: "Invalid token" });
  }
};
