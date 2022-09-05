// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Product, Order } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(200).json({ message: "Bad request" });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  //verify user
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Not authorized" });
  }

  //create array with products
  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  // exista en = $in
  const dbProducts = await Product.find({ _id: { $in: productsIds } }).lean();

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (product) =>
          new mongoose.Types.ObjectId(product._id).toString() === current._id
      )?.price;

      if (!currentPrice) {
        throw new Error("Product not found, verify your order");
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const backendTotal = subTotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error("Total is not correct");
    }

    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    await newOrder.save();
    await db.disconnect();

    res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res
      .status(400)
      .json({ message: error.message || "Bad request, check logs" });
  }

  return res.status(201).json(req.body);
};
