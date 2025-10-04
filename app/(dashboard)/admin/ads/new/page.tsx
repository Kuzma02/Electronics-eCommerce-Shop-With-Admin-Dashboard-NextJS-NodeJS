// *********************
// Role of the page: Admin page for creating new advertisement
// Name: Create New Ad Page
// Developer: AI Assistant
// Version: 1.0
// Route: /admin/ads/new
// *********************

"use client";

import React from "react";
import { DashboardSidebar, AdsForm } from "@/components";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const CreateAdPage = () => {
  const router = useRouter();

  const handleSubmit = async (adData: any) => {
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ad");
      }

      toast.success("Advertisement created successfully!");
      router.push("/admin/ads");
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast.error(error.message || "Failed to create advertisement");
    }
  };

  const handleCancel = () => {
    router.push("/admin/ads");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-8 max-xl:p-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/ads")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            Back to Ads List
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Advertisement
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details to create a new promotional ad
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl">
          <AdsForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;
