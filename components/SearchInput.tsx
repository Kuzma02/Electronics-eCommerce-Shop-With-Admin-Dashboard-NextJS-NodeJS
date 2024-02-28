import React from "react";



const SearchInput = () => {
  return (
    <form className="flex w-full justify-center">
      <input type="text" placeholder="Type here" className="input input-bordered w-[70%] rounded-r-none outline-none focus:outline-none max-sm:w-full" />
      <button className="btn bg-custom-yellow text-black border border-1 border-black rounded-l-none rounded-r-xl hover:bg-black hover:text-custom-yellow">Search</button>
    </form>
  );
};

export default SearchInput;
