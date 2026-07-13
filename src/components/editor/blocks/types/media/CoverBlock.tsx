import React, { useState } from "react";
import { FileImage } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface CoverBlockProps {
  block: { id: string; type: "cover"; url?: string; text?: string };
  onUpdate: (id: string, updated: Partial<CoverBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const CoverBlock: React.FC<CoverBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative border rounded-lg bg-gray-200 overflow-hidden">
      <button
        className="absolute top-2 right-2 bg-white p-1 rounded shadow"
        onClick={() => setShowPicker(true)}
      >
        <FileImage className="w-4 h-4" />
      </button>

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

      {block.url ? (
        <div className="relative">
          <img src={block.url} className="w-full h-64 object-cover" />
          <textarea
            className="absolute inset-0 w-full h-full bg-black/40 text-white 
                       text-3xl font-bold p-6 outline-none resize-none"
            placeholder="Cover text..."
            value={block.text || ""}
            onChange={(e) => onUpdate(block.id, { text: e.target.value })}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20 border border-dashed rounded">
          Add a cover image
        </div>
      )}
    </div>
  );
};

export default CoverBlock;
