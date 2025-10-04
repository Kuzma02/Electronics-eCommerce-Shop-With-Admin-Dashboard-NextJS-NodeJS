// *********************
// Role of the component: Form for creating and editing ads with file upload
// Name of the component: AdsForm.tsx
// Developer: AI Assistant
// Version: 2.0
// Component call: <AdsForm ad={existingAd} onSubmit={handleSubmit} onCancel={handleCancel} />
// Input parameters: ad (optional for edit), onSubmit function, onCancel function
// Output: Form with file upload, validation and submission
// *********************

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaImage,
  FaSave,
  FaTimes,
  FaSpinner,
  FaUpload,
  FaCloudUploadAlt,
} from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

interface Ad {
  id?: string;
  image: string;
  name: string;
  title: string;
  desc: string;
  startDate: string;
  endDate: string;
  isShow: boolean;
}

interface AdsFormProps {
  ad?: Ad;
  onSubmit: (ad: Omit<Ad, "id">) => Promise<void>;
  onCancel: () => void;
}

const AdsForm: React.FC<AdsFormProps> = ({ ad, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(ad?.image || "");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Ad, "id">>({
    image: ad?.image || "",
    name: ad?.name || "",
    title: ad?.title || "",
    desc: ad?.desc || "",
    startDate: ad?.startDate
      ? new Date(ad.startDate).toISOString().split("T")[0]
      : "",
    endDate: ad?.endDate
      ? new Date(ad.endDate).toISOString().split("T")[0]
      : "",
    isShow: ad?.isShow !== undefined ? ad.isShow : true,
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.image && !selectedFile) {
      newErrors.image = "Image is required";
    }
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.desc) newErrors.desc = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed"
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image; // Return existing image URL if no new file
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      // Simulate progress (since fetch doesn't support real progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch("/api/ads/upload", {
        method: "POST",
        body: uploadFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Upload image first if there's a new file
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      // Submit form with image URL
      await onSubmit({
        ...formData,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 group">
          <Image
            src={previewUrl}
            alt="Ad preview"
            fill
            className="object-cover"
          />
          {selectedFile && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              New Image Selected
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl("");
              setFormData((prev) => ({ ...prev, image: "" }));
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            title="Remove image"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Advertisement Image <span className="text-red-500">*</span>
        </label>

        {/* Drag and Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : errors.image
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCloudUploadAlt className="text-3xl text-blue-500" />
            </div>

            <div>
              <p className="text-gray-700 font-medium mb-1">
                {dragActive ? "Drop image here" : "Drag & drop your image here"}
              </p>
              <p className="text-gray-500 text-sm mb-3">or</p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <FaUpload />
                Browse Files
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Supported: JPG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-lg">
              <FaSpinner className="animate-spin text-3xl text-blue-500 mb-3" />
              <p className="text-gray-700 font-medium">Uploading...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
            </div>
          )}
        </div>

        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
        )}
      </div>

      {/* Name and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Summer Sale 2024"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Up to 50% Off!"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          placeholder="Describe your advertisement..."
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.desc ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.desc && (
          <p className="text-red-500 text-xs mt-1">{errors.desc}</p>
        )}
      </div>

      {/* Start and End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Show Toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          name="isShow"
          id="isShow"
          checked={formData.isShow}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isShow" className="text-sm font-medium text-gray-700">
          Show this advertisement (visible to users)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              {ad ? "Update Ad" : "Create Ad"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FaTimes />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdsForm;
