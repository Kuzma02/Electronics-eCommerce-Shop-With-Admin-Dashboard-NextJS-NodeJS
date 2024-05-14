"use client";

import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import Link from "next/link";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:3001/api/orders");
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
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
            {orders &&
              orders.map((order) => (
                <tr key={order?.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{order?.id}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.name}</div>
                        <div className="text-sm opacity-50">Serbia</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-success text-white badge-sm">
                      {order?.status}
                    </span>
                  </td>

                  <td>
                    <p>${order?.total}</p>
                  </td>

                  <td>{ new Date(Date.parse(order?.dateTime)).toDateString() }</td>
                  <th>
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))}
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
    </div>
  );
};

export default AdminOrders;
