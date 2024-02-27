import React from "react";
import { FaCheck } from "react-icons/fa6";

const ColorInput = () => {
  return (
    <div className="flex flex-col gap-y-2 max-[500px]:items-center">
      <p className="text-xl">
        Color: <span className="text-lg font-normal">silver</span>
      </p>
      <div className="flex gap-x-1">
        <div className="bg-gray-400 w-10 h-10 rounded-full cursor-pointer flex justify-center items-center">
          <FaCheck className="text-black" />
        </div>
        <div className="bg-gray-500 w-10 h-10 rounded-full cursor-pointer"></div>
        <div className="bg-blue-500 w-10 h-10 rounded-full cursor-pointer"></div>
      </div>
    </div>
  );
};

export default ColorInput;
