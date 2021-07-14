import type { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "../../../utils/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { code } = req.query;
  const data = await fetchData();
  const coin = data.filter(
    (c) => c.coinCode.toLowerCase() === (code as string).toLowerCase()
  );
  if (!coin.length) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(coin[0]);
  }
}
