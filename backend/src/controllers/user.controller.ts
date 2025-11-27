import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export const getProfile = async (req: Request, res: Response) => {
  try {
    // The user ID is attached to the request by the 'protect' middleware
    const userId = req.user?._id;
    if (!userId) {
      return sendError(res, 'Authentication error.', 401);
    }

    const userProfile = await userService.getUserProfileService(userId.toString());
    sendSuccess(res, userProfile, 'Profile fetched successfully');
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return sendError(res, 'Authentication error.', 401);
    }

    const updatedProfile = await userService.updateUserProfileService(
      userId.toString(),
      req.body
    );
    sendSuccess(res, updatedProfile, 'Profile updated successfully');
  } catch (error: any) {
    // Could be a validation error or user not found
    sendError(res, error.message, 400);
  }
};
