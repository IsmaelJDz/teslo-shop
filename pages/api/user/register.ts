// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils/";

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        name: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);

    default:
      res.status(400).json({ message: "Bad Request" });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = "",
    password = "",
    name = "",
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 chars" });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 chars" });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid format email" });
  }

  await db.connect();
  //const user = await User.findOne({ where: { email } });
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password, 10),
    rol: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role: "client",
      name,
    },
  });
};
