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
  const [showToolbar, setShowToolbar] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const addImage = (url: string) => {
    onUpdate(block.id, { urls: [...block.urls, url] });
    setShowPicker(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    setShowToolbar(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative border rounded-lg p-4 bg-white"
      onClick={() => setShowToolbar(true)}
      onFocusCapture={() => setShowToolbar(true)}
      onBlurCapture={handleBlur}
    >
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Gallery</h3>
        {showToolbar && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setShowPicker(true)}
              title="Add image"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onUpdate(block.id, { urls: [] })}
              title="Clear gallery"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
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
