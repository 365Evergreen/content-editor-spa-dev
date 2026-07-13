import React from "react";

export interface CoverBlockProps {
  block: {
    id: string;
    type: "cover";
    image: string;
    text: string;
  };
  onUpdate: (id: string, updated: Partial<CoverBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const CoverBlock: React.FC<CoverBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateImage = (value: string) => onUpdate(block.id, { image: value });
  const updateText = (value: string) => onUpdate(block.id, { text: value });

  return (
    <div className="py-3" onClick={onFocus}>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Cover image URL"
        value={block.image}
        onChange={(e) => updateImage(e.target.value)}
      />

      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        placeholder="Overlay text"
        value={block.text}
        onChange={(e) => updateText(e.target.value)}
      />

      {block.image && (
        <div
          className="mt-3 h-48 bg-cover bg-center flex items-center justify-center text-white text-xl font-semibold"
          style={{ backgroundImage: `url(${block.image})` }}
        >
          {block.text}
        </div>
      )}
    </div>
  );
};

export default CoverBlock;
