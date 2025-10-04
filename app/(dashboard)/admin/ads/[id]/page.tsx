// *********************
// Role of the page: Admin page for editing existing advertisement
// Name: Edit Ad Page
// Developer: AI Assistant
// Version: 1.0
// Route: /admin/ads/[id]
// *********************

"use client";

import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdsForm } from "@/components";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

interface Ad {
  id: string;
  image: string;
  name: string;
  title: string;
  desc: string;
  startDate: string;
  endDate: string;
  isShow: boolean;
}

const EditAdPage = () => {
  const router = useRouter();
  const params = useParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`/api/ads/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch ad");
        const data = await response.json();
        setAd(data);
      } catch (error) {
        console.error("Error fetching ad:", error);
        toast.error("Failed to load advertisement");
        router.push("/admin/ads");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAd();
    }
  }, [params.id, router]);

  const handleSubmit = async (adData: any) => {
    try {
      const response = await fetch(`/api/ads/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update ad");
      }

      toast.success("Advertisement updated successfully!");
      router.push("/admin/ads");
    } catch (error: any) {
      console.error("Error updating ad:", error);
      toast.error(error.message || "Failed to update advertisement");
    }
  };

  const handleCancel = () => {
    router.push("/admin/ads");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      </div>
    );
  }

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
            Edit Advertisement
          </h1>
          <p className="text-gray-600 mt-1">
            Update the details of this advertisement
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl">
          {ad && (
            <AdsForm ad={ad} onSubmit={handleSubmit} onCancel={handleCancel} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAdPage;
