"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {

const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start">
      <h3 className="text-xl">Sort by:</h3>
      <select
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="select border-gray-400 py-2 px-2 text-base border-2 select-bordered w-40 focus:outline-none outline-none max-lg:w-full"
        name="sort"
      >
        <option value="defaultSort">Default</option>
        <option value="titleAsc">Sort A-Z</option>
        <option value="titleDesc">Sort Z-A</option>
        <option value="lowPrice">Lowest Price</option>
        <option value="highPrice">Highest Price</option>
      </select>
    </div>
  );
};

export default SortBy;
