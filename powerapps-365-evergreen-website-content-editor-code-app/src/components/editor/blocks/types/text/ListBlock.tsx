import React from "react";

export interface ListBlockProps {
  block: {
    id: string;
    type: "list";
    items: string[];
  };
  onUpdate: (id: string, updated: Partial<ListBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ListBlock: React.FC<ListBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateItem = (index: number, value: string) => {
    const updated = [...block.items];
    updated[index] = value;
    onUpdate(block.id, { items: updated });
  };

  const addItem = () => {
    onUpdate(block.id, { items: [...block.items, ""] });
  };

  const removeItem = (index: number) => {
    const updated = block.items.filter((_, i) => i !== index);
    onUpdate(block.id, { items: updated });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      {block.items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder={`List item ${index + 1}`}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
          />

          <button
            className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
            onClick={() => removeItem(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addItem}
      >
        + Add Item
      </button>
    </div>
  );
};

export default ListBlock;
