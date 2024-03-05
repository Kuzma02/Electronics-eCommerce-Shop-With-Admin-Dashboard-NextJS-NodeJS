import React from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import { FaCodeCompare } from "react-icons/fa6";
import Link from "next/link";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";

const Header = () => {

  return (
    <header>
      <HeaderTop />
      <div className="h-32 flex items-center justify-between px-16 max-[1320px]:px-10 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
        <Link href="/">
          <Image
            src="/logo v1.png"
            width={200}
            height={200}
            alt="singitronic logo"
            className="w-auto h-auto"
          />
        </Link>
        <SearchInput />
        <div className="flex gap-x-10">
          <div className="relative">
            <FaCodeCompare className="text-2xl text-black" />
            <span className="block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]">
              21
            </span>
          </div>
          <HeartElement />
          <CartElement />
        </div>
      </div>
    </header>
  );
};

export default Header;
