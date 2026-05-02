"use client";

import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Video, X, Loader2 } from "lucide-react";
import { getImageUrl } from "../utils/s3";

export default function FileUpload({
  value,
  onChange,
  folder = "general",
  accept = "image/*,video/*",
  label = "Upload File",
  type = "all", // 'image', 'video', or 'all'
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(getImageUrl(value) || "");

  // Sync internal preview state when the value prop changes
  useEffect(() => {
    setPreview(getImageUrl(value) || "");
  }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview immediately for better UX
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const response = await fetch(`${origin}/api/admin/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        // Replace local preview with actual CDN URL
        setPreview(data.previewUrl || data.url);
        onChange(data.url);
        // Clean up the object URL
        URL.revokeObjectURL(localUrl);
      } else {
        alert(data.error || "Upload failed");
        setPreview(value || ""); // Revert to previous value
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
      setPreview(value || ""); // Revert to previous value
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  const isImage =
    preview &&
    (type === "image" ||
      /\.(jpg|jpeg|png|gif|webp|avif|svg)/i.test(preview) ||
      preview.includes("image") ||
      preview.includes("photo") ||
      preview.includes("images"));
  const isVideo =
    preview &&
    (type === "video" ||
      /\.(mp4|webm|ogg)/i.test(preview) ||
      preview.includes("video") ||
      preview.includes("stream"));

  const getAcceptString = () => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    return "image/*,video/*";
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-normal text-gray-500 uppercase tracking-wider mb-2">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
          {isImage && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          )}
          {isVideo && (
            <video
              src={preview}
              className="w-full h-48 object-cover"
              controls
            />
          )}
          {!isImage && !isVideo && (
            <div className="w-full h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Upload size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm truncate w-full px-4">{preview}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 shadow text-white p-2 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-300 shadow-sm transition-colors">
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin text-[#f79549]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-[#f79549]" />
                <span className="font-normal">Upload File</span>
              </>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept={getAcceptString()}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-gray-500">
        Supported:{" "}
        {type === "image"
          ? "Images"
          : type === "video"
            ? "Videos"
            : "Images & Videos"}{" "}
        • Max 50MB
      </p>
    </div>
  );
}
