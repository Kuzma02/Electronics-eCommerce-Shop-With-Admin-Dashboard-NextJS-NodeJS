// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const Header = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/">
            <img src="/logo v1 svg.svg" width={300} height={300} alt="singitronic logo" className="relative right-5 max-[1023px]:w-56" />
          </Link>
          <SearchInput />
          <div className="flex gap-x-10">
            <HeartElement />
            <CartElement />
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-48 h-auto"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <FaBell className="text-xl" />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
