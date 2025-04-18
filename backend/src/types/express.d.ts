import { User } from "../models/User";
import { Request } from "express";

interface CustomRequest<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs, Locals extends Record<string, any> = Record<string, any>> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: User | null;
}

export default CustomRequest;