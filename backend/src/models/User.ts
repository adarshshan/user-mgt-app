import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { encrypt, decrypt } from '../utils/crypto';

// Note: In a real production app, consider the implications of storing
// and encrypting PII data carefully and follow compliance regulations.

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because it will be removed from response objects
  phone: string;
  dob: string; // Storing as encrypted string
  emailVerified: boolean;
  emailVerificationToken?: string;
  otp?: string;
  otpExpiry?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, set: encrypt, get: decrypt },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, set: encrypt, get: decrypt },
    dob: { type: String, required: true, set: encrypt, get: decrypt },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
  },
  {
    timestamps: true,
    // Ensure getters are applied when converting to JSON
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare candidate password with the stored hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
