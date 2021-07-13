import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { data: volumeData } = await axios.get(
    "https://bitbns.com/order/getTickerWithVolume/"
  );
  const { data: tempCoinsData } = await axios.get(
    "https://bitbns.com/jugApi/coinParams.json"
  );

  const coinsData = tempCoinsData[0].data[0];
  const data = [];

  for (let vdKey of Object.keys(coinsData)) {
    const d1 = volumeData[vdKey.toUpperCase()];
    const d2 = coinsData[vdKey.toLowerCase()];
    if (!!d1 && !!d2) {
      data.push({
        ...d1,
        ...d2,
        percentageDiff:
          ((d1.last_traded_price - d1.yes_price) / d1.yes_price) * 100,
      });
    }
  }

  res.status(200).json(data);
}
