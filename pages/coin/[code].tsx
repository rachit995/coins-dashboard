import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiChevronRight, HiLink, HiOutlineStar, HiStar } from "react-icons/hi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import useSWR from "swr";

const SingleCoin = () => {
  const router = useRouter();
  const { code } = router.query;
  const { data } = useSWR(`/api/coins/${code}`, { refreshInterval: 1000 });
  const isLoading = !data;
  const {
    coinName,
    coinIcon,
    coinCode,
    last_traded_price,
    coinId,
    percentageDiff,
    hashLink,
    volume: { max, min },
  } = data || {
    coinName: "",
    coinIcon: "",
    coinCode: "",
    last_traded_price: "",
    volume: {},
    hashLink: "",
  };
  const price = last_traded_price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const percentage = Math.abs(percentageDiff).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
  const midVal = ((last_traded_price - min) / (max - min)).toLocaleString(
    undefined,
    {
      style: "percent",
      minimumFractionDigits: 2,
    }
  );
  let persistFavorites = [];
  if (typeof window !== "undefined") {
    persistFavorites = JSON.parse(localStorage.getItem("favorites") as string);
  }
  const [favorites, setFavorites] = useState<Number[]>(persistFavorites || []);
  const isFavorite = favorites.includes(coinId);
  return (
    <>
      <Head>
        <title>
          {isLoading ? "Loading..." : `${coinName} (${coinCode}) | ${price}`}
        </title>
      </Head>
      <div className="container px-4 pt-4 pb-8 mx-auto md:px-5">
        <div>
          <div className="inline-flex items-center my-4 space-x-2 text-xs text-gray-500">
            <Link href="/" passHref>
              <span className="cursor-pointer hover:underline">Coins</span>
            </Link>{" "}
            <HiChevronRight />
            <span>{coinName}</span>
          </div>
        </div>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="items-center my-4 space-y-4 sm:space-y-0 sm:space-x-4 sm:inline-flex">
            <div className="relative w-12 h-12 overflow-hidden rounded-full shadow">
              {coinIcon && (
                <Image
                  src={coinIcon}
                  layout="fill"
                  alt={coinName}
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPs/w8AAiMBkMscdekAAAAASUVORK5CYII="
                />
              )}
            </div>
            <h1 className="text-3xl font-bold">{coinName}</h1>
            <div className="flex items-center space-x-2">
              <button
                className={`px-2 py-1 text-sm font-semibold rounded ${
                  isFavorite
                    ? "text-yellow-500 bg-yellow-100"
                    : "text-gray-500 bg-gray-100"
                }`}
                onClick={async () => {
                  let temp: Number[] = [];
                  if (favorites.includes(coinId)) {
                    temp = favorites.filter((el) => el !== coinId);
                  } else {
                    temp = [...favorites, coinId];
                  }
                  localStorage.setItem("favorites", JSON.stringify(temp));
                  await setFavorites(temp);
                }}
              >
                {isFavorite ? (
                  <HiStar className="text-lg" />
                ) : (
                  <HiOutlineStar className="text-lg" />
                )}
              </button>
              <span className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100 rounded ">
                {coinCode}
              </span>
              <span className="px-2 py-1 text-sm font-semibold text-gray-100 bg-gray-800 rounded ">
                {`Rank #${coinId + 1}`}
              </span>
            </div>
          </div>
          <div className="my-6 sm:my-0">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">{price}</span>
              <span
                className={`${
                  percentageDiff > 0 ? "bg-green-400" : "bg-red-500"
                } text-white pr-2 pl-1 py-1 rounded text-sm inline-flex items-center font-semibold `}
              >
                {percentageDiff > 0 ? (
                  <MdArrowDropUp className="text-lg" />
                ) : (
                  <MdArrowDropDown className="text-lg" />
                )}
                {percentage}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{min}</span>
                <div className="w-32 pt-4">
                  <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded">
                    <div
                      style={{ width: midVal }}
                      className="flex flex-col justify-center text-center text-white bg-gray-400 shadow-none whitespace-nowrap"
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{max}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={hashLink} passHref>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 space-x-1 text-sm font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
              >
                <HiLink className="text-lg" />
                <span>Hash Link</span>
              </a>
            </Link>
            <Link
              href={`https://bitbns.com/trade/#/${coinCode.toLowerCase()}`}
              passHref
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 space-x-1 text-sm font-semibold text-white transition duration-200 bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
              >
                <RiMoneyDollarCircleLine className="text-lg" />
                <span>Buy / Sell</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCoin;
