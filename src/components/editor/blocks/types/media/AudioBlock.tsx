import React, { useState } from "react";
import { Music } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface AudioBlockProps {
  block: { id: string; type: "audio"; domain: "media"; url?: string };
  onUpdate: (id: string, updated: Partial<AudioBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const AudioBlock: React.FC<AudioBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative border rounded-lg p-4 bg-white">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Audio</h3>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowPicker(true)}
        >
          <Music className="w-4 h-4" />
        </button>
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
        <audio src={block.url} controls className="w-full" />
      ) : (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded">
          Upload or insert audio
        </div>
      )}
    </div>
  );
};

export default AudioBlock;
