import React, { useState } from "react";
import { Upload, FolderOpen, Link as LinkIcon, X } from "lucide-react";
import { uploadToBlob } from "../../../../../services/uploadToBlob";

export interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  mediaLibrary: string[];
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  onSelect,
  onClose,
  mediaLibrary
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const url = await uploadToBlob(file);
      onSelect(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleURLInsert = () => {
    const url = prompt("Enter media URL");
    if (url) onSelect(url);
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-white border shadow-lg rounded-lg p-4 z-30">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Insert Media</h3>
        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload */}
      <label className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>{isUploading ? "Uploading..." : "Upload"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}

      {/* Media Library */}
      <div className="flex items-center gap-2 p-2 border rounded mt-3">
        <FolderOpen className="w-4 h-4" />
        <span>Select from Library</span>
      </div>

      {mediaLibrary.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {mediaLibrary.map((url) => (
            <img
              key={url}
              src={url}
              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => onSelect(url)}
            />
          ))}
        </div>
      )}

      {/* Insert from URL */}
      <button
        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 w-full mt-3"
        onClick={handleURLInsert}
      >
        <LinkIcon className="w-4 h-4" />
        <span>Insert from URL</span>
      </button>

      {/* Close */}
      <button
        className="mt-4 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default MediaPicker;
