import { DashboardProductTable, DashboardSidebar } from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[100vh]">
      <DashboardSidebar />
      <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
