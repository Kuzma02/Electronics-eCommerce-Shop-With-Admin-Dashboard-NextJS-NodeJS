"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";

interface DashboardUserDetailsProps {
  params: { id: number };
}

const DashboardSingleUserPage = ({
  params: { id },
}: DashboardUserDetailsProps) => {
  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const router = useRouter();

  const deleteUser = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:3001/api/users/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("User deleted successfully");
          router.push("/admin/users");
        } else {
          throw Error("There was an error while deleting user");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting user");
      });
  };

  const updateUser = async () => {
    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.newPassword.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("You entered invalid email address format");
        return;
      }

      if (userInput.newPassword.length > 7) {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userInput.email,
            password: userInput.newPassword,
            role: userInput.role,
          }),
        };
        fetch(`http://localhost:3001/api/users/${id}`, requestOptions)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw Error("Error while updating user");
            }
          })
          .then((data) => toast.success("User successfully updated"))
          .catch((error) => {
            toast.error("There was an error while updating user");
          });
      } else {
        toast.error("Password must be longer than 7 characters");
        return;
      }
    } else {
      toast.error("For updating a user you must enter all values");
      return;
    }
  };

  useEffect(() => {
    // sending API request for a single user
    fetch(`http://localhost:3001/api/users/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInput({
          email: data?.email,
          newPassword: "",
          role: data?.role,
        });
      });
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">User details</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">New password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setUserInput({ ...userInput, newPassword: e.target.value })
              }
              value={userInput.newPassword}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select
              className="select select-bordered"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={updateUser}
          >
            Update user
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteUser}
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
