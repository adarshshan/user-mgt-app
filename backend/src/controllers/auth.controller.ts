import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    loginStep?: "otp";
    tempUserId?: string;
    checking?: string;
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserService(req.body);
    sendSuccess(res, result, "Registration successful", 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (typeof token !== "string") {
      return sendError(res, "Token is required", 400);
    }
    const result = await authService.verifyEmailService(token);
    sendSuccess(res, result, "Email verified successfully");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const loginStep1 = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginPasswordStepService(email, password);

    // Temporarily store user ID in session, waiting for OTP verification
    req.session.loginStep = "otp";
    req.session.tempUserId = result.userId.toString();

    console.log("...req.session...step1");
    console.log(req.session);

    req.session.save((err) => {
      if (err) {
        console.error("Failed to save session in loginStep1:", err);
        return sendError(res, "Failed to initiate login process", 500);
      }
      sendSuccess(res, { userId: result.userId }, "OTP sent");
    });
  } catch (error: any) {
    console.log(error as Error);
    sendError(res, error.message, 401);
  }
};

export const loginStep2 = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const userId = req.session.tempUserId;

    console.log("...req.session...step2");
    console.log(req.session);

    if (!userId || req.session.loginStep !== "otp") {
      return sendError(res, "Invalid login sequence. Please start over.", 400);
    }

    const user = await authService.loginOtpStepService(userId, otp);

    // Create a secure session
    req.session.userId = user._id.toString();
    req.session.loginStep = undefined;
    req.session.tempUserId = undefined;

    req.session.save((err) => {
      if (err) {
        return sendError(res, "Failed to save session", 500);
      }
      sendSuccess(res, { message: "Login successful" }, "Logged in");
    });
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return sendError(res, "Could not log out, please try again.", 500);
    }
    // Clear the session cookie
    res.clearCookie("connect.sid"); // The default session cookie name
    sendSuccess(res, null, "Logged out successfully");
  });
};

export const getCsrfToken = (req: Request, res: Response) => {
  sendSuccess(res, { csrfToken: req.csrfToken() });
};
