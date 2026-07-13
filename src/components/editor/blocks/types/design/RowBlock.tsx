import React from "react";

export interface RowBlockProps {
  block: {
    id: string;
    type: "row";
    items: string[];
  };
  onUpdate: (id: string, updated: Partial<RowBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const RowBlock: React.FC<RowBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateItem = (index: number, value: string) => {
    const updated = [...block.items];
    updated[index] = value;
    onUpdate(block.id, { items: updated });
  };

  const addItem = () => {
    onUpdate(block.id, { items: [...block.items, ""] });
  };

  const removeItem = (index: number) => {
    onUpdate(block.id, { items: block.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="flex gap-4">
        {block.items.map((item, index) => (
          <div key={index} className="flex-1">
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              placeholder={`Row item ${index + 1}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
            />

            <button
              className="mt-2 px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
              onClick={() => removeItem(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addItem}
      >
        + Add Row Item
      </button>
    </div>
  );
};

export default RowBlock;
