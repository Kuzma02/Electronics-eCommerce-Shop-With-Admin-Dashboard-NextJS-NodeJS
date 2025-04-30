// *********************
// Role: Project Upload Page
// Purpose: Creates new projects and handles initial file upload
// Features:
// - Project name input
// - File upload interface with progress and validation
// - Form validation
// - Automatic navigation to materials page after creation
// *********************

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UploadProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit.");
      return false;
    }

    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadData = await uploadResponse.json();
      setUploadMessage("File uploaded successfully.");
      setUploadProgress(100);
      return uploadData.filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Failed to upload file.");
      setUploadProgress(0);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const file = fileInputRef.current?.files?.[0];
    let filePath = null;

    if (file) {
      filePath = await handleFileUpload(file);
      if (!filePath) {
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/contractor/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          filePath: filePath,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Upload Project
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700"
          >
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

        <div>
          <label
            htmlFor="projectFile"
            className="block text-sm font-medium text-gray-700"
          >
            Upload PDF (Max 20MB)
          </label>
          <div className="mt-1">
            <input
              type="file"
              id="projectFile"
              name="projectFile"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={() => setUploadProgress(0)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          {uploadProgress > 0 && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload Progress: {uploadProgress}%
              </p>
            </div>
          )}
          {uploadMessage && (
            <p className="text-sm text-gray-700 mt-2">{uploadMessage}</p>
          )}
        </div>

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
