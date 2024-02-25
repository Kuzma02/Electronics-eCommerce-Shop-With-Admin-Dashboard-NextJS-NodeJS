import React from "react";



const SearchInput = () => {
  return (
    <form className="flex max-sm:w-full">
      <input type="text" placeholder="Type here" className="input input-bordered w-full w-[700px] max-[1320px]:w-[450px] rounded-r-none outline-none focus:outline-none max-sm:w-full" />
      <button className="btn bg-custom-yellow text-black rounded-l-none rounded-r-xl hover:bg-black hover:text-custom-yellow border-custom-yellow">Search</button>
    </form>
  );
};

export default SearchInput;
