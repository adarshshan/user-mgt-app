import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   GET /api/auth/verify-email
// @desc    Verify user's email with a token
router.get('/verify-email', authController.verifyEmail);

// @route   POST /api/auth/login
// @desc    Login step 1: Verify password and send OTP
router.post('/login', authController.loginStep1);

// @route   POST /api/auth/verify-otp
// @desc    Login step 2: Verify OTP and create session
router.post('/verify-otp', authController.loginStep2);

// @route   POST /api/auth/logout
// @desc    Destroy session and log user out
router.post('/logout', authController.logout);




export default router;
