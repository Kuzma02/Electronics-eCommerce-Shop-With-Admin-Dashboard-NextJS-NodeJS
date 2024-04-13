import { DashboardSidebar } from "@/components";
import React from "react";

const DashboardCreateNewUser = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[100vh]">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 pl-5 w-full">
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

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2"
          >
            Create user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
