import React from "react";

export interface ButtonsBlockProps {
  block: {
    id: string;
    type: "buttons";
    buttons: { label: string; url: string }[];
  };
  onUpdate: (id: string, updated: Partial<ButtonsBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ButtonsBlock: React.FC<ButtonsBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateButton = (index: number, field: "label" | "url", value: string) => {
    const updated = block.buttons.map((btn, i) =>
      i === index ? { ...btn, [field]: value } : btn
    );
    onUpdate(block.id, { buttons: updated });
  };

  const addButton = () => {
    onUpdate(block.id, { buttons: [...block.buttons, { label: "", url: "" }] });
  };

  const removeButton = (index: number) => {
    onUpdate(block.id, { buttons: block.buttons.filter((_, i) => i !== index) });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      {block.buttons.map((btn, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder="Button label"
            value={btn.label}
            onChange={(e) => updateButton(index, "label", e.target.value)}
          />

          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder="Button URL"
            value={btn.url}
            onChange={(e) => updateButton(index, "url", e.target.value)}
          />

          <button
            className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
            onClick={() => removeButton(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addButton}
      >
        + Add Button
      </button>
    </div>
  );
};

export default ButtonsBlock;
