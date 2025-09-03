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

interface ProjectFile {
  id: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedFilesForImport, setSelectedFilesForImport] = useState<string[]>([]);

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

        const productsResponse = await fetch(`/api/products`);
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch uploaded files
        const filesResponse = await fetch(
          `/api/contractor/projects/${params.projectId}/files`
        );
        if (!filesResponse.ok) {
          throw new Error("Failed to fetch uploaded files");
        }
        const filesData = await filesResponse.json();
        setUploadedFiles(filesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size exceeds 20MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch(`/api/contractor/projects/${params.projectId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const result = await response.json();
      
      // Refresh the file list
      const filesResponse = await fetch(`/api/contractor/projects/${params.projectId}/files`);
      if (!filesResponse.ok) {
        throw new Error('Failed to fetch uploaded files');
      }
      const filesData = await filesResponse.json();
      setUploadedFiles(filesData);
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    }
  };

  const toggleFileSelection = (filePath: string) => {
    console.log("Current selection:", selectedFilesForImport);
    console.log("Toggling file:", filePath);
    
    setSelectedFilesForImport(prev => {
      const newSelection = prev.includes(filePath) 
        ? prev.filter(path => path !== filePath) 
        : [...prev, filePath];
      
      console.log("New selection:", newSelection);
      return newSelection;
    });
  };

  const handleImportList = async () => {
    if (selectedFilesForImport.length === 0) {
      toast.error("Please select at least one file to import");
      return;
    }

    try {
      setLoading(true);
      
      // Process each selected file
      for (const filePath of selectedFilesForImport) {
        const response = await fetch(`/api/projects/upload-material`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: params.projectId,
            filePath: filePath,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to import from file: ${filePath}`);
        }
      }

      // Refresh the materials list
      const materialsResponse = await fetch(
        `/api/contractor/projects/${params.projectId}/materials`
      );
      
      if (!materialsResponse.ok) {
        throw new Error("Failed to refresh materials list");
      }
      
      const materialsData = await materialsResponse.json();
      const processedMaterials = materialsData.map((material: any) => ({
        ...material,
        name: material.name || material.product?.title || "Unknown Material",
      }));
      
      setMaterials(processedMaterials);
      
      // Clear the selection
      setSelectedFilesForImport([]);
      
      toast.success("Materials imported successfully");
    } catch (error) {
      console.error("Error importing materials:", error);
      toast.error("Failed to import materials");
    } finally {
      setLoading(false);
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - File list */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Files</h2>
              <button
                onClick={handleImportList}
                disabled={selectedFilesForImport.length === 0 || loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Import List
              </button>
            </div>
            
            {uploadedFiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No files uploaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      id={`file-${file.id}`}
                      checked={selectedFilesForImport.includes(file.path)}
                      onChange={() => toggleFileSelection(file.path)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`file-${file.id}`}
                      className="ml-3 block text-sm font-medium text-gray-700 truncate cursor-pointer flex-1"
                    >
                      {file.originalname}
                    </label>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
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

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Material from PDF</h2>
            <div className="flex flex-col items-start space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                multiple
              />
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="fileInput"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload PDF Files
                </label>
                <span className="text-sm text-gray-500">
                  Only PDF files up to 20MB are allowed
                </span>
              </div>
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
      </div>
    </div>
  );
}
