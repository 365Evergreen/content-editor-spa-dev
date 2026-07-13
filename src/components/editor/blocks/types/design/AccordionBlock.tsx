import React from "react";

export interface AccordionBlockProps {
  block: {
    id: string;
    type: "accordion";
    items: { title: string; content: string }[];
  };
  onUpdate: (id: string, updated: Partial<AccordionBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const AccordionBlock: React.FC<AccordionBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateItem = (index: number, field: "title" | "content", value: string) => {
    const updated = block.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate(block.id, { items: updated });
  };

  const addItem = () => {
    onUpdate(block.id, { items: [...block.items, { title: "", content: "" }] });
  };

  const removeItem = (index: number) => {
    onUpdate(block.id, { items: block.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      {block.items.map((item, index) => (
        <div key={index} className="border rounded p-3 mb-3">
          <input
            type="text"
            className="w-full border rounded px-2 py-1 mb-2"
            placeholder="Accordion title"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
          />

          <textarea
            className="w-full border rounded px-2 py-1"
            placeholder="Accordion content"
            rows={3}
            value={item.content}
            onChange={(e) => updateItem(index, "content", e.target.value)}
          />

          <button
            className="mt-2 px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
            onClick={() => removeItem(index)}
          >
            ✕ Remove
          </button>
        </div>
      ))}

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addItem}
      >
        + Add Accordion Item
      </button>
    </div>
  );
};

export default AccordionBlock;
