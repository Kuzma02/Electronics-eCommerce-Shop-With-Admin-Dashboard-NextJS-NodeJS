"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const searchProducts = (e: any) => {
    e.preventDefault();
    router.push(`/search?search=${searchInput}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Type here"
        className="bg-gray-50 input input-bordered w-[70%] rounded-r-none outline-none focus:outline-none max-sm:w-full"
      />
      <button type="submit" className="btn bg-blue-600 text-white rounded-l-none rounded-r-xl hover:bg-blue-700">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
