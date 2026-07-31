// *********************
// IN DEVELOPMENT
// *********************

import React from "react";
import { FaArrowUp } from "react-icons/fa6";


const StatsElement = () => {
  return (
    <div className="w-80 h-32 bg-brand-primary text-brand-primary-content flex flex-col justify-center items-center rounded-md max-md:w-full">
      <h4 className="text-xl text-brand-primary-content">New Products</h4>
      <p className="text-2xl font-bold">2,230</p>
      <p className="text-green-300 flex gap-x-1 items-center"><FaArrowUp />12.5% Since last month</p>
    </div>
  );
};

export default StatsElement;
