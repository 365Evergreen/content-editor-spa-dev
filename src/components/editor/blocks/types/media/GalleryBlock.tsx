import React from "react";

export interface GalleryBlockProps {
  block: {
    id: string;
    type: "gallery";
    images: string[];
  };
  onUpdate: (id: string, updated: Partial<GalleryBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateImage = (index: number, value: string) => {
    const updated = [...block.images];
    updated[index] = value;
    onUpdate(block.id, { images: updated });
  };

  const addImage = () => {
    onUpdate(block.id, { images: [...block.images, ""] });
  };

  const removeImage = (index: number) => {
    const updated = block.images.filter((_, i) => i !== index);
    onUpdate(block.id, { images: updated });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      {block.images.map((src, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder="Image URL"
            value={src}
            onChange={(e) => updateImage(index, e.target.value)}
          />
          <button
            className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
            onClick={() => removeImage(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addImage}
      >
        + Add Image
      </button>
    </div>
  );
};

export default GalleryBlock;
