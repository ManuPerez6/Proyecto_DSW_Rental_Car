import { IUser, User } from './user.entity.js';

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
  return await User.findOne({ username });
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find({});
};
