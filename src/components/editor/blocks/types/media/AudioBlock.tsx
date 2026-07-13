import React from "react";

export interface AudioBlockProps {
  block: {
    id: string;
    type: "audio";
    src: string;
  };
  onUpdate: (id: string, updated: Partial<AudioBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const AudioBlock: React.FC<AudioBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSrc = (value: string) => {
    onUpdate(block.id, { src: value });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Audio URL"
        value={block.src}
        onChange={(e) => updateSrc(e.target.value)}
      />

      {block.src && (
        <audio controls className="w-full">
          <source src={block.src} />
        </audio>
      )}
    </div>
  );
};

export default AudioBlock;
