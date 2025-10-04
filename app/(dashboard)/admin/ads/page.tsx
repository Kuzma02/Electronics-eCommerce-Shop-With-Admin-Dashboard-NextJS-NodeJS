// *********************
// Role of the page: Admin page for managing advertisements
// Name: Ads Management Page
// Developer: AI Assistant
// Version: 1.0
// Route: /admin/ads
// *********************

"use client";

import React, { useEffect, useState } from "react";
import { DashboardSidebar, AdsTable } from "@/components";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Ad {
  id: string;
  image: string;
  name: string;
  title: string;
  desc: string;
  startDate: string;
  endDate: string;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdsManagementPage = () => {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "scheduled" | "expired"
  >("all");

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ads");
      if (!response.ok) throw new Error("Failed to fetch ads");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete ad");

      toast.success("Ad deleted successfully!");
      fetchAds(); // Refresh list
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Failed to delete ad");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/ads/${id}`);
  };

  const handleToggleShow = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isShow: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update ad");

      toast.success(`Ad ${!currentStatus ? "shown" : "hidden"} successfully!`);
      fetchAds(); // Refresh list
    } catch (error) {
      console.error("Error toggling ad visibility:", error);
      toast.error("Failed to update ad");
    }
  };

  const getFilteredAds = () => {
    const now = new Date();
    switch (filter) {
      case "active":
        return ads.filter(
          (ad) =>
            ad.isShow &&
            new Date(ad.startDate) <= now &&
            new Date(ad.endDate) >= now
        );
      case "scheduled":
        return ads.filter((ad) => new Date(ad.startDate) > now);
      case "expired":
        return ads.filter((ad) => new Date(ad.endDate) < now);
      default:
        return ads;
    }
  };

  const filteredAds = getFilteredAds();

  return (
    <div className="bg-gray-50 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-8 max-xl:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Advertisement Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage your promotional advertisements
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/ads/new")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Create New Ad
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Ads</p>
              <p className="text-2xl font-bold text-gray-800">{ads.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  ads.filter(
                    (ad) =>
                      ad.isShow &&
                      new Date(ad.startDate) <= new Date() &&
                      new Date(ad.endDate) >= new Date()
                  ).length
                }
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-gray-800">
                {ads.filter((ad) => new Date(ad.startDate) > new Date()).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
              <p className="text-gray-600 text-sm">Expired</p>
              <p className="text-2xl font-bold text-gray-800">
                {ads.filter((ad) => new Date(ad.endDate) < new Date()).length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "active", "scheduled", "expired"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === filterOption
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <AdsTable
            ads={filteredAds}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleShow={handleToggleShow}
          />
        )}
      </div>
    </div>
  );
};

export default AdsManagementPage;
