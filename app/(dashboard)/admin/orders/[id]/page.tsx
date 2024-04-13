import { DashboardSidebar } from "@/components";
import React from "react";

const AdminSingleOrder = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[150vh]">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 ml-5 w-full">
        <h1 className="text-3xl font-semibold">Order details</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order ID:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div className="flex gap-x-2">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Name:</span>
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
                <span className="label-text">Lastname:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
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
              <span className="label-text">Email adress:</span>
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
              <span className="label-text">Company (optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        <div className="flex gap-x-2">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Adress:</span>
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
                <span className="label-text">Apartment, suite, etc. :</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-x-2">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
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
                <span className="label-text">Country:</span>
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
                <span className="label-text">Postal Code:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order status</span>
            </div>
            <select className="select select-bordered">
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <textarea className="textarea textarea-bordered h-24"></textarea>
          </label>
        </div>
        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
          >
            Update order
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
          >
            Delete order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
