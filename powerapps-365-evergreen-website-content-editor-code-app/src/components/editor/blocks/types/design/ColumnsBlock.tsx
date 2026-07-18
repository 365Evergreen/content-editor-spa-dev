import React from "react";

export interface ColumnsBlockProps {
  block: {
    id: string;
    type: "columns";
    columns: string[]; // simple text columns for now
  };
  onUpdate: (id: string, updated: Partial<ColumnsBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateColumn = (index: number, value: string) => {
    const updated = [...block.columns];
    updated[index] = value;
    onUpdate(block.id, { columns: updated });
  };

  const addColumn = () => {
    onUpdate(block.id, { columns: [...block.columns, ""] });
  };

  const removeColumn = (index: number) => {
    onUpdate(block.id, { columns: block.columns.filter((_, i) => i !== index) });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.columns.map((col, index) => (
          <div key={index} className="border rounded p-3">
            <textarea
              className="w-full border rounded px-2 py-1"
              rows={4}
              placeholder={`Column ${index + 1}`}
              value={col}
              onChange={(e) => updateColumn(index, e.target.value)}
            />

            <button
              className="mt-2 px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
              onClick={() => removeColumn(index)}
            >
              ✕ Remove Column
            </button>
          </div>
        ))}
      </div>

      <button
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addColumn}
      >
        + Add Column
      </button>
    </div>
  );
};

export default ColumnsBlock;
