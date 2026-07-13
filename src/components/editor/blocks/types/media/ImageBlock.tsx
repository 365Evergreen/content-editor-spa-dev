import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface ImageBlockProps {
  block: { id: string; type: "image"; url?: string };
  onUpdate: (id: string, updated: Partial<ImageBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      className="relative border rounded-lg p-4 bg-white"
      onClick={() => setShowToolbar(true)}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute -top-12 left-0 bg-white border shadow-md rounded-lg 
                        flex items-center gap-2 px-3 py-2 z-20">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              setShowPicker(true);
              setShowToolbar(false);
            }}
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => onUpdate(block.id, { url: undefined })}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Picker */}
      {showPicker && (
        <MediaPicker
          mediaLibrary={mediaLibrary}
          onSelect={(url) => {
            onUpdate(block.id, { url });
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Preview */}
      {block.url ? (
        <img src={block.url} className="w-full rounded" />
      ) : (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded">
          Drag & drop, upload, or insert an image
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
