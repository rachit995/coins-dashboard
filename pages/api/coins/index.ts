import type { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "../../../utils/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await fetchData();
  res.status(200).json(data);
}
