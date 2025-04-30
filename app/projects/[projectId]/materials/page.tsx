// *********************
// Role: Project Materials Management Page
// Purpose: Allows contractors to manage materials for a specific project
// Features:
// - Lists all materials in a project
// - Adds new materials from product catalog
// - Updates material quantities
// - Removes materials from project
// - Maintains project item count
// *********************

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Type definitions for data structures
interface Material {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  productId: string;
  product?: {
    id: string;
    title: string;
    description?: string;
    price: number;
    mainImage: string;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  inStock: number;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; path: string }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsResponse = await fetch(
          `/api/contractor/projects/${params.projectId}/materials`
        );
        if (!materialsResponse.ok) {
          throw new Error("Failed to fetch materials");
        }
        const materialsData = await materialsResponse.json();

        const processedMaterials = materialsData.map((material: any) => ({
          ...material,
          name: material.name || material.product?.title || "Unknown Material",
        }));

        setMaterials(processedMaterials);

        const productsResponse = await fetch("/api/products");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const filesResponse = await fetch(
          "/api/contractor/projects/uploaded-files"
        );
        if (!filesResponse.ok) {
          throw new Error("Failed to fetch uploaded files");
        }
        const filesData = await filesResponse.json();
        setUploadedFiles(filesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load materials");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.projectId]);

  const handleAddMaterial = async () => {
    try {
      const response = await fetch(
        `/api/contractor/projects/${params.projectId}/materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: selectedProduct,
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      const newMaterial = await response.json();

      const materialWithName = {
        ...newMaterial,
        name:
          newMaterial.name || newMaterial.product?.title || "Unknown Material",
      };

      setMaterials([...materials, materialWithName]);

      await fetch(`/api/contractor/projects/${params.projectId}/recalculate`, {
        method: "POST",
      });

      toast.success("Material added successfully");
      setSelectedProduct("");
      setNewQuantity(1);
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("Failed to add material");
    }
  };

  const handleUpdateQuantity = async (
    materialId: string,
    newQuantity: number
  ) => {
    try {
      const response = await fetch(
        `/api/contractor/projects/${params.projectId}/materials/${materialId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setMaterials(
        materials.map((material) =>
          material.id === materialId
            ? { ...material, quantity: newQuantity }
            : material
        )
      );
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const response = await fetch(
        `/api/contractor/projects/${params.projectId}/materials/${materialId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      setMaterials(materials.filter((material) => material.id !== materialId));

      await fetch(`/api/contractor/projects/${params.projectId}/recalculate`, {
        method: "POST",
      });

      toast.success("Material deleted successfully");
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Failed to delete material");
    }
  };

  const handleUploadMaterial = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const response = await fetch(`/api/contractor/projects/upload-material`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: params.projectId,
          filePath: selectedFile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload material");
      }

      const result = await response.json();
      toast.success("Material uploaded successfully");
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error("Failed to upload material");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Materials</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Material</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Material</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title} (In Stock: {product.inStock})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Quantity"
          />
          <button
            onClick={handleAddMaterial}
            disabled={!selectedProduct}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Add Material
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Material from PDF</h2>
        <div className="flex items-center">
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Uploaded PDF</option>
            {uploadedFiles.map((file) => (
              <option key={file.path} value={file.path}>
                {file.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleUploadMaterial}
            disabled={!selectedFile}
            className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Material Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Unit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {material.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {material.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingMaterial?.id === material.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editingMaterial.quantity}
                      onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    material.quantity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {material.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingMaterial?.id === material.id ? (
                    <>
                      <button
                        onClick={() => {
                          handleUpdateQuantity(
                            material.id,
                            editingMaterial.quantity
                          );
                          setEditingMaterial(null);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMaterial(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingMaterial(material)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
