// *********************
// Role: Project Upload Page
// Purpose: Creates new projects and handles initial file upload
// Features:
// - Project name input
// - File upload interface (for future implementation)
// - Form validation
// - Automatic navigation to materials page after creation
// *********************

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UploadProjectPage() {
  // Routing and state management
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission and project creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create new project in database
      const response = await fetch("/api/contractor/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Navigate to materials page on success
      const data = await response.json();
      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}/materials`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project name input field */}
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="projectName"
              name="projectName"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter project name"
            />
          </div>
        </div>

        {/* File upload input (prepared for future implementation) */}
        <div>
          <label htmlFor="projectFile" className="block text-sm font-medium text-gray-700">
            Project File
          </label>
          <div className="mt-1">
            <input
              type="file"
              id="projectFile"
              name="projectFile"
              accept=".txt"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>

        {/* Submit button with loading state */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
} 