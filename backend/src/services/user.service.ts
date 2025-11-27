import User, { IUser } from '../models/User';

// --- Get User Profile ---
export const getUserProfileService = async (userId: string): Promise<Partial<IUser>> => {
  // The 'protect' middleware already fetches the user and attaches it to the request.
  // This service could add more business logic if needed, like populating related data.
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  // Manually create a plain object to control returned fields
  const userProfile = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    emailVerified: user.emailVerified,
  };

  return userProfile;
};

// --- Update User Profile ---
export const updateUserProfileService = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<Partial<IUser>> => {
  // Find the user first to ensure they exist
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  // Update allowed fields. Email is not updatable. Password is updated separately.
  if (updateData.name) user.name = updateData.name;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.dob) user.dob = updateData.dob;
  // Note: The 'set' function in the schema will handle encryption automatically

  const updatedUser = await user.save();

  // Return a clean profile object
  const userProfile = {
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    dob: updatedUser.dob,
  };

  return userProfile;
};
