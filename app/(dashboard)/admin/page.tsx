import { DashboardSidebar, StatsElement } from "@/components";
import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const AdminDashboardPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 gap-y-4">
        <div className="flex gap-x-5 justify-center w-full">
          <StatsElement />
          <StatsElement />
          <StatsElement />
        </div>
        <div className="w-full bg-blue-600 text-white h-40 flex flex-col justify-center items-center gap-y-2">
          <h4 className="text-3xl text-gray-100">Number of visitors today</h4>
          <p className="text-3xl font-bold">1200</p>
          <p className="text-green-300 flex gap-x-1 items-center"><FaArrowUp />12.5% Since last month</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
