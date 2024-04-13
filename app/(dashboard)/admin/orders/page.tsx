import { AdminOrders, DashboardSidebar } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[100vh]">
      <DashboardSidebar />
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;
