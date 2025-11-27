import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);

      if (user) {
        req.user = user;
        next();
      } else {
        sendError(res, "Not authorized, user not found", 401);
      }
    } catch (error) {
      sendError(res, "Not authorized, token failed", 401);
    }
  } else {
    sendError(res, "Not authorized, no session", 401);
  }
};
