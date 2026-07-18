import React from "react";
import { List, ListOrdered, Minus, Plus } from "lucide-react";

export interface ListBlockProps {
  block: {
    id: string;
    type: "list";
    items: string[];
    ordered?: boolean;
  };
  onUpdate: (id: string, updated: Partial<ListBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ListBlock: React.FC<ListBlockProps> = ({ block, onUpdate, onFocus }) => {
  const [showToolbar, setShowToolbar] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  const removeLastItem = () => {
    if (block.items.length === 0) return;
    onUpdate(block.id, { items: block.items.slice(0, -1) });
  };

  const setOrdered = (ordered: boolean) => {
    onUpdate(block.id, { ordered });
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    setShowToolbar(false);
  };

  return (
    <div
      ref={containerRef}
      className="py-3"
      onClick={() => {
        setShowToolbar(true);
        onFocus?.();
      }}
      onFocusCapture={() => setShowToolbar(true)}
      onBlurCapture={handleBlur}
    >
      {showToolbar && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border bg-white px-2 py-1">
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setOrdered(false)} title="Bulleted list">
          <List className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setOrdered(true)} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 border-l" />
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={addItem} title="Add list item">
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={removeLastItem} title="Remove last list item">
          <Minus className="h-4 w-4" />
        </button>
        </div>
      )}

      {block.items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <span className="pt-2 text-sm text-gray-500 w-6 text-right">
            {block.ordered ? `${index + 1}.` : "•"}
          </span>
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
        type="button"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addItem}
      >
        + Add Item
      </button>
    </div>
  );
};

export default ListBlock;
