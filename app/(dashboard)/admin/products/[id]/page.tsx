"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";

interface DashboardProductDetailsProps {
    params: {id: number };
}

const DashboardProductDetails = ({ params: {id} }: DashboardProductDetailsProps) => {
    const [ product, setProduct ] = useState<any>();
    
    useEffect(() => {        
        fetch(`http://localhost:3001/api/products/${id}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setProduct(data);
          });
      }, [id]);

      console.log(product);
      
    
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[100vh]">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 ml-5">
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Product price:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Stock availability:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div>
          <input
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            multiple
          />
        </div>
        <div className="flex gap-x-2">
          <CustomButton
            paddingX={5}
            paddingY={5}
            text="Update product"
            buttonType="button"
            customWidth="100px"
            textSize="lg"
          />
          <button
            type="button"
            className="w=[100px] uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
          >
            Delete product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
