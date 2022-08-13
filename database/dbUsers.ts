import { db } from ".";
import { User } from "../models";
import bcrypt from "bcryptjs";

export const checkEmailPassword = async (email: string, password: string) => {
  await db.connect();

  const user = await User.findOne({ email }).lean();
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    role,
    email: email.toLocaleLowerCase(),
    name,
    _id,
  };
};

export const verifyOathUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  if (!user) {
    const newUser = new User({
      name: oAuthName,
      email: oAuthEmail,
      role: "client",
      password: "@",
    });

    await newUser.save();
    await db.disconnect();
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }
};
