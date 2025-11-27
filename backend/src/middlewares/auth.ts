import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the user object
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Middleware to protect routes that require authentication.
// It checks if a user ID is stored in the session.
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    try {
      // Find the user by the ID stored in the session
      const user = await User.findById(req.session.userId);

      if (user) {
        // Attach user to the request object (excluding the password)
        req.user = user;
        next(); // User is authenticated, proceed to the next middleware/controller
      } else {
        sendError(res, 'Not authorized, user not found', 401);
      }
    } catch (error) {
      sendError(res, 'Not authorized, token failed', 401);
    }
  } else {
    sendError(res, 'Not authorized, no session', 401);
  }
};
