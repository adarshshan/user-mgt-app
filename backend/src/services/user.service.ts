import User, { IUser } from "../models/User";

export const getUserProfileService = async (
  userId: string
): Promise<Partial<IUser>> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const userProfile = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    emailVerified: user.emailVerified,
  };

  return userProfile;
};

export const updateUserProfileService = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<Partial<IUser>> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (updateData.name) user.name = updateData.name;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.dob) user.dob = updateData.dob;

  const updatedUser = await user.save();

  const userProfile = {
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    dob: updatedUser.dob,
  };

  return userProfile;
};
