import React, { useState } from "react";
import { Video } from "lucide-react";
import MediaPicker from "./MediaPicker";

export interface VideoBlockProps {
  block: { id: string; type: "video"; url?: string };
  onUpdate: (id: string, updated: Partial<VideoBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative border rounded-lg p-4 bg-white">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Video</h3>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setShowPicker(true)}
        >
          <Video className="w-4 h-4" />
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
        <video src={block.url} controls className="w-full rounded" />
      ) : (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded">
          Upload or insert a video
        </div>
      )}
    </div>
  );
};

export default VideoBlock;
