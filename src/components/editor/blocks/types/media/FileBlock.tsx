import React, { useState } from "react";
import { File, X } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface FileBlockProps {
  block: { id: string; type: "file"; url?: string };
  onUpdate: (id: string, updated: Partial<FileBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const FileBlock: React.FC<FileBlockProps> = ({
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
      className="relative border rounded-lg p-4 bg-white"
      onClick={() => setShowToolbar(true)}
      onFocusCapture={() => setShowToolbar(true)}
      onBlurCapture={handleBlur}
    >
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">File</h3>
        {showToolbar && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setShowPicker(true)}
              title="Select file"
            >
              <File className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onUpdate(block.id, { url: undefined })}
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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
        <a href={block.url} className="text-blue-600 underline">
          Download File
        </a>
      ) : (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded">
          Upload or insert a file
        </div>
      )}
    </div>
  );
};

export default FileBlock;
