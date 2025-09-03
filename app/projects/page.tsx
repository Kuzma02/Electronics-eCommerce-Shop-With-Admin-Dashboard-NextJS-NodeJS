// *********************
// Role: Projects List Page
// Purpose: Displays and manages all projects for the contractor
// Features:
// - Lists all projects with their details (name, date, item count)
// - Allows editing project names
// - Enables project deletion
// - Provides navigation to create new projects
// - Handles checkout functionality for project materials
// *********************

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useProductStore } from "../_zustand/store";

// Type definitions for project and material data
interface Project {
  id: string;
  name: string;
  createdAt: string;
  itemCount: number;
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    mainImage: string;
  };
}

export default function ProjectsPage() {
  // State management for projects and UI
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  // Authentication and routing hooks
  const { data: session } = useSession();
  const router = useRouter();
  
  // Cart management from global store
  const { clearCart, addToCart, calculateTotals } = useProductStore();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/contractor/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project name editing
  const handleEdit = async (projectId: string) => {
    if (!editName.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/contractor/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Update local state with new project name
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, name: editName }
          : project
      ));
      setEditingProject(null);
      setEditName("");
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  // Handle project deletion
  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/contractor/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove deleted project from local state
      setProjects(projects.filter(project => project.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  // Handle checkout process for project materials
  const handleCheckout = async (projectId: string) => {
    try {
      // Clear existing cart before adding new items
      clearCart();

      // Fetch materials for the project
      const response = await fetch(`/api/contractor/projects/${projectId}/materials`);
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }

      const materials = await response.json();
      if (!materials || materials.length === 0) {
        toast.error("No materials to checkout");
        return;
      }

      // Transform materials and add to cart
      materials.forEach((material: any) => {
        if (material.product && material.quantity > 0) {
          addToCart({
            id: material.product.id,
            title: material.product.title,
            price: material.product.price,
            image: material.product.mainImage,
            amount: material.quantity
          });
        }
      });

      // Update cart totals and redirect to cart page
      calculateTotals();
      router.push("/cart");
      toast.success("Materials added to cart");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to process checkout");
    }
  };

  // Loading state display
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your construction projects and their materials.
            </p>
          </div>
          {projects.length > 0 && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link
                href="/projects/upload"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Start New Project
              </Link>
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">
              No projects uploaded yet. Start by uploading your construction documents.
            </p>
            <div className="mt-6">
              <Link
                href="/projects/upload"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Upload Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Project Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Created Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Number of Items
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {editingProject === project.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="Project name"
                                />
                                <input
                                  type="file"
                                  accept=".txt"
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100"
                                />
                                <button
                                  onClick={() => handleEdit(project.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingProject(null);
                                    setEditName("");
                                  }}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <Link href={`/projects/${project.id}`}>
                                  <span className="text-lg font-medium text-gray-900">{project.name}</span>
                                </Link>
                                <button
                                  onClick={() => {
                                    setEditingProject(project.id);
                                    setEditName(project.name);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(project.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {project.itemCount} items
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              href={`/projects/${project.id}/materials`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              View Materials
                            </Link>
                            {project.itemCount > 0 && (
                              <button
                                onClick={() => handleCheckout(project.id)}
                                className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 hover:bg-green-100"
                              >
                                Checkout
                              </button>
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
        )}
      </div>
    </div>
  );
} 