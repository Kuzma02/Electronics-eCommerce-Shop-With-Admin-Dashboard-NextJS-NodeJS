import React from "react";



const SearchInput = () => {
  return (
    <form className="flex w-full justify-center">
      <input type="text" placeholder="Type here" className="input input-bordered w-[70%] rounded-r-none outline-none focus:outline-none max-sm:w-full" />
      <button className="btn bg-blue-600 text-white rounded-l-none rounded-r-xl hover:bg-blue-700">Search</button>
    </form>
  );
};

export default SearchInput;
