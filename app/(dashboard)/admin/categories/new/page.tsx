"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
  });

  const addNewCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.post(`/api/categories`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 201) {
          await response.json();
          toast.success("Category added successfully");
          setCategoryInput({
            name: "",
          });
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.error || "There was an error while creating category"
          );
        }
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error("There was an error while creating category");
      }
    } else {
      toast.error("You need to enter values to add a category");
    }
  };
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new category</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewCategory}
          >
            Create category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
