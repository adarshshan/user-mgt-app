import crypto from "crypto";
import User from "../models/User";
import { sendVerificationEmail, sendOtpEmail } from "../utils/email";
import { IUser } from "../models/User";

// --- Registration ---
export const registerUserService = async (userData: Partial<IUser>) => {
  const { name, email, password, phone, dob } = userData;

  if (!name || !email || !password || !phone || !dob) {
    throw new Error("Please provide all required fields.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User with this email already exists.");
  }

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  console.log("saved in db .... emailVerificationToken");
  console.log(emailVerificationToken);

  const user = new User({
    name,
    email,
    password,
    phone,
    dob,
    emailVerificationToken,
  });

  await user.save();
  await sendVerificationEmail(user.email, emailVerificationToken);

  return {
    message:
      "Registration successful. Please check your email to verify your account.",
  };
};

// --- Email Verification ---
export const verifyEmailService = async (token: string) => {
  const user = await User.findOne({ emailVerificationToken: token.trim() });

  console.log(user);

  if (!user) {
    throw new Error("Invalid verification token.");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return { message: "Email verified successfully. You can now log in." };
};

// --- Login Step 1: Password Verification ---
export const loginPasswordStepService = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials.");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  // Generate and save OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save({ validateBeforeSave: false }); // Skip validation to save otp fields

  // Send OTP email
  await sendOtpEmail(user.email, otp);

  return { message: "OTP sent to your email.", userId: user._id };
};

// --- Login Step 2: OTP Verification ---
export const loginOtpStepService = async (userId: string, otp: string) => {
  if (!userId || !otp) {
    throw new Error("User ID and OTP are required.");
  }

  const user = await User.findById(userId).select("+otp +otpExpiry");

  if (!user || !user.otp || !user.otpExpiry) {
    throw new Error("Could not find user or OTP request.");
  }

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    throw new Error("Invalid or expired OTP.");
  }

  // Clear OTP fields after successful verification
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  // Return user for session creation
  return user;
};
