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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadProgress(0);
    setUploadMessage("");
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Validate all files
      const invalidFiles = newFiles.filter(file => 
        file.type !== "application/pdf" || file.size > 20 * 1024 * 1024
      );
      
      if (invalidFiles.length > 0) {
        toast.error("Some files are invalid. Only PDF files up to 20MB are allowed.");
        return;
      }
      
      setSelectedFiles(newFiles);
      setUploadMessage(`${newFiles.length} file(s) selected`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      
      // Update the upload message with the new count
      if (newFiles.length === 0) {
        setUploadMessage("");
      } else {
        setUploadMessage(`${newFiles.length} file(s) selected`);
      }
      
      return newFiles;
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilesUpload = async (files: File[], projectId: string) => {
    const uploadedFiles = [];
    let progress = 0;
    
    for (const file of files) {
      const formData = new FormData();
      formData.append("files", file);  // This matches the backend's expected field name

      try {
        const uploadResponse = await fetch(`/api/contractor/projects/${projectId}/files`, {
          method: "POST",
          body: formData,
          credentials: 'include',  // Include cookies for authentication
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }

        const uploadData = await uploadResponse.json();
        uploadedFiles.push(uploadData);
        
        // Update progress
        progress = Math.round(((uploadedFiles.length) / files.length) * 100);
        setUploadProgress(progress);
        
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    if (uploadedFiles.length > 0) {
      setUploadMessage(`${uploadedFiles.length} of ${files.length} files uploaded successfully.`);
      return uploadedFiles;
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the project
      const createResponse = await fetch("/api/contractor/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',  // Include cookies for authentication
        body: JSON.stringify({
          name: projectName,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create project");
      }

      const projectData = await createResponse.json();
      
      // Then upload files if any
      if (selectedFiles.length > 0) {
        const uploadedFiles = await handleFilesUpload(selectedFiles, projectData.id);
        if (!uploadedFiles || uploadedFiles.length === 0) {
          toast.error("Failed to upload files");
        }
      }

      toast.success("Project created successfully!");
      router.push(`/projects/${projectData.id}/materials`);
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
            htmlFor="projectFiles"
            className="block text-sm font-medium text-gray-700"
          >
            Upload PDF Files (Max 20MB each)
          </label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="projectFiles"
              className="cursor-pointer px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md font-semibold text-sm hover:bg-indigo-100"
            >
              Choose files
              <input
                type="file"
                id="projectFiles"
                name="projectFiles"
                accept="application/pdf"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="ml-3 text-sm text-gray-500">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} file(s)` 
                : "No file chosen"}
            </span>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="relative flex items-center justify-between bg-gray-100 border border-gray-200 rounded-md py-2 px-3"
                  >
                    <div className="text-sm text-gray-700 truncate max-w-[80%] font-medium">
                      {file.name}
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
          {uploadMessage && !selectedFiles.length && (
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
