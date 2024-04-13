import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="w-[400px] bg-blue-500 h-full">
      <Link href="/admin">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <MdDashboard className="text-2xl" />{" "}
          <span className="font-normal">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaBagShopping className="text-2xl" />{" "}
          <span className="font-normal">Orders</span>
        </div>
      </Link>
      <Link href="/admin/products">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaTable className="text-2xl" />{" "}
          <span className="font-normal">Products</span>
        </div>
      </Link>
      <Link href="/admin/users">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaRegUser className="text-2xl" />{" "}
          <span className="font-normal">Users</span>
        </div>
      </Link>
      <Link href="/admin/settings">
        <div className="flex gap-x-2 w-full hover:bg-blue-600 cursor-pointer items-center py-6 pl-5 text-xl text-white">
          <FaGear className="text-2xl" />{" "}
          <span className="font-normal">Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;
