// *********************
// Role of the component: Display and manage ads in a table format
// Name of the component: AdsTable.tsx
// Developer: AI Assistant
// Version: 1.0
// Component call: <AdsTable ads={ads} onDelete={handleDelete} onEdit={handleEdit} />
// Input parameters: ads array, onDelete function, onEdit function
// Output: Table with ads management functionality
// *********************

"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaCalendar } from "react-icons/fa";
import Image from "next/image";

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

interface AdsTableProps {
  ads: Ad[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleShow: (id: string, currentStatus: boolean) => void;
}

const AdsTable: React.FC<AdsTableProps> = ({
  ads,
  onDelete,
  onEdit,
  onToggleShow,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getStatusBadge = (ad: Ad) => {
    const active = isActive(ad.startDate, ad.endDate);
    if (!ad.isShow) {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
          Hidden
        </span>
      );
    }
    if (active) {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          Active
        </span>
      );
    }
    const start = new Date(ad.startDate);
    if (start > new Date()) {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
          Scheduled
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        Expired
      </span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Period
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ads.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No ads found. Create your first ad!
              </td>
            </tr>
          ) : (
            ads.map((ad) => (
              <tr
                key={ad.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={ad.image}
                      alt={ad.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ad.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {ad.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {ad.desc}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-700 flex items-center gap-1">
                    <FaCalendar className="text-blue-500" />
                    <span>{formatDate(ad.startDate)}</span>
                  </div>
                  <div className="text-xs text-gray-700 flex items-center gap-1 mt-1">
                    <FaCalendar className="text-red-500" />
                    <span>{formatDate(ad.endDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(ad)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleShow(ad.id, ad.isShow)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        ad.isShow
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={ad.isShow ? "Hide Ad" : "Show Ad"}
                    >
                      {ad.isShow ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => onEdit(ad.id)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                      title="Edit Ad"
                    >
                      <FaEdit />
                    </button>
                    {deleteConfirm === ad.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            onDelete(ad.id);
                            setDeleteConfirm(null);
                          }}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(ad.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        title="Delete Ad"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdsTable;
