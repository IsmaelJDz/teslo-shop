// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDatabase } from "../../database";
import { Product } from "../../models";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({ message: "Can't access this API" });
  }

  await db.connect();
  await Product.deleteMany({});
  await Product.insertMany(seedDatabase.initialData.products);

  res.status(200).json({ message: "Process was successful" });
}
