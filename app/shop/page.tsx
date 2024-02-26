import { Breadcrumb, Filters, Pagination, Products } from "@/components";
import React from "react";

const ShopPage = () => {
  return (
    <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
      <Breadcrumb />
      <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
        <Filters />
        <div>
          <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg">SAMSUNG SMART PHONES</h2>
          <div className="divider"></div>
          <Products />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
