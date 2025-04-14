import { User } from "../models/User"; // Įsitikinkite, kad kelias į User modelį yra teisingas
import { Request } from "express";

interface CustomRequest extends Request {
  user?: User | null; // Priklauso nuo jūsų naudotojo tipo
}

export default CustomRequest;