import React from "react";
import OrderItem from "./OrderItem";
import Link from "next/link";

const AdminOrders = () => {
  return (
    <div className="ml-5 w-full">
      <table className="table overflow-scroll">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Order ID</th>
            <th>Name and country</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr key={1123}>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>

            <td>
              <div>
                <p className="font-bold">#2121321</p>
              </div>
            </td>

            <td>
              <div className="flex items-center gap-5">
                <div>
                  <div className="font-bold">Aleksandar Kuzmanovic</div>
                  <div className="text-sm opacity-50">Serbia</div>
                </div>
              </div>
            </td>

            <td>
              <span className="badge badge-success text-white badge-sm">
                Proccessing
              </span>
            </td>

            <td>
              <p>48 minutes ago</p>
            </td>

            <td>$22</td>
            <th>
              <Link
                href={`/admin/orders/1232`}
                className="btn btn-ghost btn-xs"
              >
                details
              </Link>
            </th>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>Name and country</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdminOrders;
