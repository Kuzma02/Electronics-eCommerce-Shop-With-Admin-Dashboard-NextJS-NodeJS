"use client";
import { DashboardSidebar } from "@/components";
import React from "react";

const DashboardCreateNewUser = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-[100vh] max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new user</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select className="select select-bordered">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Create user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
