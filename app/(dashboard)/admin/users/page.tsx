"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DashboardUsers = () => {
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-[120vh]">
      <DashboardSidebar />
      <div className="overflow-x-auto w-full">
        <h1 className="text-3xl font-semibold text-center mb-5">All users</h1>
        <div className="flex justify-end mb-5">
          <Link href="/admin/users/new">
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Add new user"
            />
          </Link>
        </div>

        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users &&
              users.map((user) => (
                <tr key={nanoid()}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div className="flex items-center gap-3">
                      <p>{user?.email}</p>
                    </div>
                  </td>
                  <td>
                    <p>admin</p>
                  </td>
                  <th>
                    <Link
                      href={`/admin/users/${user?.id}`}
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
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DashboardUsers;
