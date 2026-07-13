import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface GalleryBlockProps {
  block: { id: string; type: "gallery"; urls: string[] };
  onUpdate: (id: string, updated: Partial<GalleryBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const addImage = (url: string) => {
    onUpdate(block.id, { urls: [...block.urls, url] });
    setShowPicker(false);
  };

  return (
    <div className="relative border rounded-lg p-4 bg-white">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Gallery</h3>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowPicker(true)}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showPicker && (
        <MediaPicker
          mediaLibrary={mediaLibrary}
          onSelect={addImage}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        {block.urls.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} className="w-full h-24 object-cover rounded" />
            <button
              className="absolute top-1 right-1 bg-white rounded p-1"
              onClick={() =>
                onUpdate(block.id, {
                  urls: block.urls.filter((_, idx) => idx !== i)
                })
              }
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryBlock;
