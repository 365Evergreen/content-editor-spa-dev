import React, { useState } from "react";
import { Eraser, FileImage, X } from "lucide-react";
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
  const [showToolbar, setShowToolbar] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    setShowToolbar(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative border rounded-lg bg-gray-200 overflow-hidden"
      onClick={() => setShowToolbar(true)}
      onFocusCapture={() => setShowToolbar(true)}
      onBlurCapture={handleBlur}
    >
      {showToolbar && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded bg-white/90 p-1 shadow">
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setShowPicker(true)}
            title="Select cover image"
          >
            <FileImage className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => onUpdate(block.id, { url: undefined })}
            title="Remove cover image"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => onUpdate(block.id, { text: "" })}
            title="Clear cover text"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      )}

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
