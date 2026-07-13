import React from "react";

export interface VideoBlockProps {
  block: {
    id: string;
    type: "video";
    src: string;
  };
  onUpdate: (id: string, updated: Partial<VideoBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSrc = (value: string) => onUpdate(block.id, { src: value });

  return (
    <div className="py-3" onClick={onFocus}>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Video URL"
        value={block.src}
        onChange={(e) => updateSrc(e.target.value)}
      />

      {block.src && (
        <video controls className="w-full mt-3">
          <source src={block.src} />
        </video>
      )}
    </div>
  );
};

export default VideoBlock;
