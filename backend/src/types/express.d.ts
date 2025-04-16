import { User } from "../models/User"; // Įsitikinkite, kad kelias į User modelį yra teisingas
import { Request } from "express";

interface CustomRequest<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs, Locals extends Record<string, any> = Record<string, any>> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: User | null; // Priklauso nuo jūsų naudotojo tipo
}

export default CustomRequest;