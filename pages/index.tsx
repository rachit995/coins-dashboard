import Image from "next/image";
import { useState } from "react";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import useSWR from "swr";
import { SORT } from "../constants/constants";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const { data = [], mutate } = useSWR("/api/list-coins");
  const [sort, setSort] = useState(SORT.NAME_ASC);
  const direction = sort.substr(sort.length - 3);
  const reverse = direction === "DSC";
  const sortEntity = sort.substr(0, 3);
  let coinsList = data.filter((d) =>
    d.coinName.toLowerCase().includes(searchText.toLowerCase())
  );
  if (sortEntity === "NAM") {
    coinsList = coinsList.sort((a, b) => a.coinName.localeCompare(b.coinName));
  }
  if (sortEntity === "PRI") {
    coinsList = coinsList.sort((a, b) => {
      if (a.last_traded_price > b.last_traded_price) return -1;
      if (a.last_traded_price < b.last_traded_price) return 1;
      return 0;
    });
  }
  if (sortEntity === "VOL") {
    coinsList = coinsList.sort((a, b) => {
      if (a.volume.volume > b.volume.volume) return -1;
      if (a.volume.volume < b.volume.volume) return 1;
      return 0;
    });
  }
  if (sortEntity === "PER") {
    coinsList = coinsList.sort((a, b) => {
      if (a.percentageDiff > b.percentageDiff) return -1;
      if (a.percentageDiff < b.percentageDiff) return 1;
      return 0;
    });
  }
  if (reverse) coinsList.reverse();
  const directionArrow = () => {
    return reverse ? <HiArrowDown /> : <HiArrowUp />;
  };
  return (
    <div>
      <input
        type="search"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th
              onClick={() => setSort(reverse ? SORT.NAME_ASC : SORT.NAME_DESC)}
            >
              <span>Name</span>
              {sortEntity === "NAM" && directionArrow()}
            </th>
            <th
              onClick={() =>
                setSort(reverse ? SORT.PRICE_ASC : SORT.PRICE_DESC)
              }
            >
              <span>Price</span>
              {sortEntity === "PRI" && directionArrow()}
            </th>
            <th
              onClick={() =>
                setSort(reverse ? SORT.VOLUME_ASC : SORT.VOLUME_DESC)
              }
            >
              <span>Volume</span>
              {sortEntity === "VOL" && directionArrow()}
            </th>
            <th
              onClick={() =>
                setSort(reverse ? SORT.PERCENTAGE_ASC : SORT.PERCENTAGE_DESC)
              }
            >
              <span>Percentage</span>
              {sortEntity === "PER" && directionArrow()}
            </th>
          </tr>
        </thead>
        <tbody>
          {coinsList.map(
            ({
              coinId,
              coinIcon,
              coinName,
              last_traded_price,
              volume: { volume },
              percentageDiff,
            }) => {
              return (
                <tr key={coinId}>
                  <td>
                    <Image
                      src={coinIcon}
                      width={35}
                      height={35}
                      alt={coinName}
                    />
                  </td>
                  <td>{coinName}</td>
                  <td>{last_traded_price}</td>
                  <td>{volume}</td>
                  <td>{percentageDiff}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
