// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../../interfaces";

type Data = { message: string } | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProductError(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
async function searchProductError(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (Object.keys(req.query).length === 0) {
    return res
      .status(400)
      .json({ message: "Bad request, you should to search a term" });
  }
}
