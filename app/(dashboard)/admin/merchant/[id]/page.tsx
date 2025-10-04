"use client";
import React, { useEffect, useState, use } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  inStock: number;
}

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: Product[];
}

interface MerchantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });

  const router = useRouter();

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/merchants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/admin/merchant");
          return;
        }
        throw new Error("Failed to fetch merchant");
      }
      
      const data = await response.json();
      setMerchant(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Error fetching merchant:", error);
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]); 

const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // This is the correct way to use apiClient.put
    // It should just take the URL and the data object
    const response = await apiClient.put(`/api/merchants/${id}`, formData);

    if (!response.ok) {
      throw new Error("Failed to update merchant");
    }

    toast.success("Merchant updated successfully");
    fetchMerchant(); // Refresh data
  } catch (error) {
    console.error("Error updating merchant:", error);
    toast.error("Failed to update merchant");
  }
};

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this merchant?")) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/merchants/${id}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete merchant");
      }
      
      toast.success("Merchant deleted successfully");
      router.push("/admin/merchant");
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Failed to delete merchant"
          : "Failed to delete merchant"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex items-center justify-center">
          Loading merchant details...
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex items-center justify-center">
          Merchant not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Merchant Details</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/merchant"
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Back to Merchants
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete Merchant
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 h-32"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Merchant Products</h2>
          {merchant.products.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Title</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">In Stock</th>
                  <th className="py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchant.products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">{product.title}</td>
                    <td className="py-4">${product.price / 100}</td>
                    <td className="py-4">{product.inStock}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No products for this merchant yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}