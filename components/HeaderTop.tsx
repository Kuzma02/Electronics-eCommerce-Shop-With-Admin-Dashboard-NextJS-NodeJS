import Link from "next/link";
import React from "react";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  return (
    <div className="h-10 text-black bg-gray-100 px-10 max-md:px-5 max-md:h-16">
      <div className="flex justify-between h-full max-md:flex-col max-md:justify-center max-md:items-center max-w-screen-2xl mx-auto">
        <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2">
            <FaHeadphones className="text-black" />
            <span>+381 61 123 321</span>
          </li>
          <li className="flex items-center gap-x-2">
            <FaRegEnvelope className="text-black" />
            <span>test@email.com</span>
          </li>
        </ul>
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2">
            <FaLocationDot className="text-black" />
            <span>Store location</span>
          </li>
          <li className="flex items-center">
            <Link href="/login" className="flex items-center gap-x-2">
              <FaRegUser className="text-black" />
              <span>Login</span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/register" className="flex items-center gap-x-2">
              <FaRegUser className="text-black" />
              <span>Register</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
