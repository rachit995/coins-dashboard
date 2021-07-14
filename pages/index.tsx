import { Switch } from "@headlessui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiSearch, HiSortAscending, HiSortDescending } from "react-icons/hi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import useSWR from "swr";
import { SORT } from "../constants/constants";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const { data = [] } = useSWR("/api/coins");
  const [sort, setSort] = useState(SORT.RANK_ASC);
  const direction = sort.substr(sort.length - 3);
  const reverse = direction === "DSC";
  const sortEntity = sort.substr(0, 3);
  let persistFavorites = [];
  if (typeof window !== "undefined") {
    persistFavorites = JSON.parse(localStorage.getItem("favorites") as string);
  }
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Number[]>(persistFavorites || []);
  let coinsList = data.filter(
    (d: any) =>
      d.coinName.toLowerCase().includes(searchText.toLowerCase()) ||
      d.coinCode.toLowerCase().includes(searchText.toLowerCase())
  );
  if (sortEntity === "RAN") {
    coinsList = coinsList.sort((a: any, b: any) => {
      if (a.coinId > b.coinId) return 1;
      if (a.coinId < b.coinId) return -1;
      return 0;
    });
  }
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
  if (showFavorites) {
    coinsList = coinsList.filter((coin: any) =>
      favorites.includes(coin.coinId)
    );
  }
  return (
    <>
      <Head>
        <title>Coins List</title>
      </Head>
      <section className="text-gray-600 body-font">
        <div className="container pt-4 pb-8 mx-auto md:px-5">
          <div className="w-full my-4 sm:inline-flex sm:justify-between">
            <div className="relative mx-4 sm:mx-0">
              <input
                type="search"
                placeholder="Search coin"
                autoComplete="search"
                name="search"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                className="w-full py-2 pl-10 pr-2 border rounded-lg outline-none sm:w-auto"
              />
              <div className="absolute top-0 flex items-center h-full left-3">
                <HiSearch className="text-xl text-gray-300 " />
              </div>
            </div>
            <div className="inline-flex items-center mx-6 mt-4 space-x-4 sm:mx-0 ">
              <label className="text-sm">Show Favorites</label>
              <Switch
                checked={showFavorites}
                onChange={setShowFavorites}
                className={`${
                  showFavorites ? "bg-yellow-400" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition duration-150`}
              >
                <span className="sr-only">Show Favorites</span>
                <span
                  className={`${
                    showFavorites ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition duration-150`}
                />
              </Switch>
            </div>
          </div>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full text-left whitespace-no-wrap divide-y divide-gray-200 table-auto ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="w-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
                        onClick={() =>
                          setSort(reverse ? SORT.RANK_ASC : SORT.RANK_DESC)
                        }
                      >
                        <div className="inline-flex items-center space-x-2">
                          <span>#</span>
                          {sortEntity === "RAN" && directionArrow()}
                        </div>
                      </th>
                      <th className="w-4"></th>
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
                    {coinsList.length ? (
                      coinsList.map(
                        ({
                          coinId,
                          coinIcon,
                          coinName,
                          last_traded_price,
                          volume: { volume },
                          percentageDiff,
                          coinCode,
                        }: {
                          coinId: number;
                          coinIcon: string;
                          coinName: string;
                          last_traded_price: number;
                          volume: { volume: number };
                          percentageDiff: number;
                          coinCode: string;
                        }) => {
                          return (
                            <tr
                              key={coinId}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              <Link
                                passHref
                                href={`/coin/${coinCode.toLowerCase()}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {coinId + 1}
                                  </div>
                                </td>
                              </Link>
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
                                    <RiStarFill className="text-lg text-yellow-400 hover:text-gray-400" />
                                  ) : (
                                    <RiStarLine className="text-lg text-gray-400 hover:text-yellow-400" />
                                  )}
                                </button>
                              </td>
                              <Link
                                passHref
                                href={`/coin/${coinCode.toLowerCase()}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-4">
                                    <div className="relative w-8 h-8 overflow-hidden rounded-full shadow">
                                      <Image
                                        src={coinIcon}
                                        alt={coinName}
                                        layout="fill"
                                        objectFit="cover"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPs/w8AAiMBkMscdekAAAAASUVORK5CYII="
                                      />
                                    </div>
                                    <div className="">
                                      <div className="text-sm font-medium text-gray-900">
                                        {coinName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {coinCode}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </Link>
                              <Link
                                passHref
                                href={`/coin/${coinCode.toLowerCase()}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {`${last_traded_price.toLocaleString(
                                      "en-IN",
                                      {
                                        style: "currency",
                                        currency: "INR",
                                      }
                                    )}`}
                                  </div>
                                </td>
                              </Link>
                              <Link
                                passHref
                                href={`/coin/${coinCode.toLowerCase()}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {(
                                      volume * last_traded_price
                                    ).toLocaleString("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {volume}
                                  </div>
                                </td>
                              </Link>
                              <Link
                                passHref
                                href={`/coin/${coinCode.toLowerCase()}`}
                              >
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
                              </Link>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          No coins
                        </td>
                      </tr>
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
