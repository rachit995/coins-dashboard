import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import {
  HiOutlineStar,
  HiSortAscending,
  HiSortDescending,
  HiStar,
} from "react-icons/hi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import useSWR from "swr";
import { SORT } from "../constants/constants";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const { data = [] } = useSWR("/api/list-coins");
  const [sort, setSort] = useState("");
  const direction = sort.substr(sort.length - 3);
  const reverse = direction === "DSC";
  const sortEntity = sort.substr(0, 3);
  let persistFavorites = [];
  if (typeof window !== "undefined") {
    persistFavorites = JSON.parse(localStorage.getItem("favorites") as string);
  }

  const [favorites, setFavorites] = useState<Number[]>(persistFavorites || []);
  let coinsList = data.filter((d: any) =>
    d.coinName.toLowerCase().includes(searchText.toLowerCase())
  );
  if (sortEntity === "NAM") {
    coinsList = coinsList.sort((a: any, b: any) =>
      a.coinName.localeCompare(b.coinName)
    );
  }
  if (sortEntity === "PRI") {
    coinsList = coinsList.sort((a: any, b: any) => {
      if (a.last_traded_price > b.last_traded_price) return -1;
      if (a.last_traded_price < b.last_traded_price) return 1;
      return 0;
    });
  }
  if (sortEntity === "VOL") {
    coinsList = coinsList.sort((a: any, b: any) => {
      if (a.volume.volume > b.volume.volume) return -1;
      if (a.volume.volume < b.volume.volume) return 1;
      return 0;
    });
  }
  if (sortEntity === "PER") {
    coinsList = coinsList.sort((a: any, b: any) => {
      if (a.percentageDiff > b.percentageDiff) return -1;
      if (a.percentageDiff < b.percentageDiff) return 1;
      return 0;
    });
  }
  if (reverse) coinsList.reverse();
  const directionArrow = () => {
    return reverse ? <HiSortAscending /> : <HiSortDescending />;
  };
  return (
    <>
      <Head>
        <title>Coins List</title>
      </Head>
      <section className="text-gray-600 body-font">
        <div className="container py-24 mx-auto md:px-5">
          <input
            type="search"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full text-left whitespace-no-wrap divide-y divide-gray-200 table-auto ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        #
                      </th>
                      <th></th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() =>
                          setSort(reverse ? SORT.NAME_ASC : SORT.NAME_DESC)
                        }
                      >
                        <div className="inline-flex items-center space-x-2">
                          <span>Coin</span>
                          {sortEntity === "NAM" && directionArrow()}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        scope="col"
                        onClick={() =>
                          setSort(reverse ? SORT.PRICE_ASC : SORT.PRICE_DESC)
                        }
                      >
                        <div className="inline-flex items-center space-x-2">
                          <span>Price</span>
                          {sortEntity === "PRI" && directionArrow()}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        scope="col"
                        onClick={() =>
                          setSort(reverse ? SORT.VOLUME_ASC : SORT.VOLUME_DESC)
                        }
                      >
                        <div className="inline-flex items-center space-x-2">
                          <span>Volume</span>
                          {sortEntity === "VOL" && directionArrow()}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        scope="col"
                        onClick={() =>
                          setSort(
                            reverse ? SORT.PERCENTAGE_ASC : SORT.PERCENTAGE_DESC
                          )
                        }
                      >
                        <div className="inline-flex items-center space-x-2">
                          <span>Percentage</span>
                          {sortEntity === "PER" && directionArrow()}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coinsList.map(
                      ({
                        coinId,
                        coinIcon,
                        coinName,
                        last_traded_price,
                        volume: { volume },
                        percentageDiff,
                      }: {
                        coinId: number;
                        coinIcon: string;
                        coinName: string;
                        last_traded_price: number;
                        volume: { volume: number };
                        percentageDiff: number;
                      }) => {
                        const coinCode = coinIcon
                          .substring(
                            coinIcon.lastIndexOf("/") + 1,
                            coinIcon.lastIndexOf(".")
                          )
                          .toUpperCase();
                        return (
                          <tr key={coinId} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {coinId + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={async () => {
                                  let temp: Number[] = [];
                                  if (favorites.includes(coinId)) {
                                    temp = favorites.filter(
                                      (el) => el !== coinId
                                    );
                                  } else {
                                    temp = [...favorites, coinId];
                                  }
                                  localStorage.setItem(
                                    "favorites",
                                    JSON.stringify(temp)
                                  );
                                  await setFavorites(temp);
                                }}
                              >
                                {favorites.includes(coinId) ? (
                                  <HiStar className="text-lg text-yellow-400 hover:text-gray-400" />
                                ) : (
                                  <HiOutlineStar className="text-lg text-gray-400 hover:text-yellow-400" />
                                )}
                              </button>
                            </td>

                            <td className="px-6 py-4 cursor-pointer whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10">
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={coinIcon}
                                      alt={coinName}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                </div>
                                <div className="ml-2">
                                  <div className="text-sm font-medium text-gray-900">
                                    {coinName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {coinCode}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {`${last_traded_price.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                })}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {(volume * last_traded_price).toLocaleString(
                                  "en-IN",
                                  {
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {volume}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`inline-flex items-center font-semibold text-sm text-gray-900 ${
                                  percentageDiff > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {percentageDiff > 0 ? (
                                  <MdArrowDropUp className="text-lg" />
                                ) : (
                                  <MdArrowDropDown className="text-lg" />
                                )}
                                {Math.abs(percentageDiff).toLocaleString(
                                  undefined,
                                  {
                                    style: "percent",
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
