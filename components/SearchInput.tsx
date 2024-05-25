// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  // After it we will grab URL on the search page and send GET request for searched products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
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
      <button type="submit" className="btn bg-blue-500 text-white rounded-l-none rounded-r-xl hover:bg-blue-600">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
