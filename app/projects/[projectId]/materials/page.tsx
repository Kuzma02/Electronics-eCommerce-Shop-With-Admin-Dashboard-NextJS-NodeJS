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
  // State management for materials and UI
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  
  // Routing and authentication hooks
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch materials and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project materials
        const materialsResponse = await fetch(`/api/contractor/projects/${params.projectId}/materials`);
        if (!materialsResponse.ok) {
          throw new Error("Failed to fetch materials");
        }
        const materialsData = await materialsResponse.json();
        
        // Ensure each material has a name property, using product.title as fallback
        const processedMaterials = materialsData.map((material: any) => ({
          ...material,
          name: material.name || (material.product?.title || "Unknown Material")
        }));
        
        setMaterials(processedMaterials);

        // Fetch available products catalog
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load materials");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.projectId]);

  // Handle adding new material to project
  const handleAddMaterial = async () => {
    try {
      // Create new material entry
      const response = await fetch(`/api/contractor/projects/${params.projectId}/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      // Update local state with new material
      const newMaterial = await response.json();
      
      // Make sure the material has a name property derived from the product if needed
      const materialWithName = {
        ...newMaterial,
        name: newMaterial.name || (newMaterial.product?.title || "Unknown Material")
      };
      
      setMaterials([...materials, materialWithName]);
      
      // Update project item count
      await fetch(`/api/contractor/projects/${params.projectId}/recalculate`, {
        method: "POST",
      });

      // Reset form and show success message
      toast.success("Material added successfully");
      setSelectedProduct("");
      setNewQuantity(1);
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("Failed to add material");
    }
  };

  // Handle updating material quantity
  const handleUpdateQuantity = async (materialId: string, newQuantity: number) => {
    try {
      // Update material quantity in database
      const response = await fetch(`/api/contractor/projects/${params.projectId}/materials/${materialId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update local state with new quantity
      setMaterials(materials.map(material => 
        material.id === materialId 
          ? { ...material, quantity: newQuantity }
          : material
      ));
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Handle removing material from project
  const handleDeleteMaterial = async (materialId: string) => {
    try {
      // Delete material from database
      const response = await fetch(`/api/contractor/projects/${params.projectId}/materials/${materialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      // Remove material from local state
      setMaterials(materials.filter(material => material.id !== materialId));
      
      // Update project item count
      await fetch(`/api/contractor/projects/${params.projectId}/recalculate`, {
        method: "POST",
      });

      toast.success("Material deleted successfully");
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Failed to delete material");
    }
  };

  // Loading state display
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
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

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Project Materials</h2>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Material Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {materials.map((material) => (
                    <tr key={material.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {material.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {material.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingMaterial?.id === material.id ? (
                          <input
                            type="number"
                            min="1"
                            value={editingMaterial.quantity}
                            onChange={(e) => setEditingMaterial({
                              ...editingMaterial,
                              quantity: parseInt(e.target.value)
                            })}
                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        ) : (
                          material.quantity
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {material.unit}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {editingMaterial?.id === material.id ? (
                          <>
                            <button
                              onClick={() => {
                                handleUpdateQuantity(material.id, editingMaterial.quantity);
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
        </div>
      </div>
    </div>
  );
} 