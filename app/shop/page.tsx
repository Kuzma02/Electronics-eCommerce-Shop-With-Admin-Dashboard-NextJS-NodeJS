import { Breadcrumb, Filters } from "@/components";
import React from "react";

const ShopPage = () => {
  return (
    <div className=" max-w-screen-2xl mx-auto px-10">
      <Breadcrumb />
      <div className="grid grid-cols-[200px_1fr] gap-x-2">
        <Filters />
        <div>
          <h2 className="text-2xl font-bold">SAMSUNG SMART PHONES</h2>
          <div className="divider"></div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
