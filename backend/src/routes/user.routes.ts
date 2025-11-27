import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth';

const router = Router();

// All routes in this file are protected and require a logged-in user.
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get current user's profile
router.get('/profile', userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
router.put('/profile', userController.updateProfile);

export default router;
