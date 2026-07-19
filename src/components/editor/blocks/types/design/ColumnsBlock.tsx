import React from "react";
import NestedBlocksEditor from "./NestedBlocksEditor";
import type { Block } from "../../../../../hooks/useBlocks";

export interface ColumnsBlockProps {
  block: {
    id: string;
    type: "columns";
    alignment?: "none" | "wide" | "full";
    verticalAlignment?: "top" | "middle" | "bottom" | "stretch";
    stackOnMobile?: boolean;
    columns: Array<{
      id: string;
      width?: string;
      blocks: Block[];
    }>;
  };
  onUpdate: (id: string, updated: Partial<ColumnsBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSetting = (field: "alignment" | "verticalAlignment" | "stackOnMobile", value: string | boolean) => {
    onUpdate(block.id, { [field]: value });
  };

  const addColumn = () => {
    onUpdate(block.id, {
      columns: [
        ...(block.columns || []),
        {
          id: crypto.randomUUID(),
          width: "",
          blocks: []
        }
      ]
    });
  };

  const removeColumn = (index: number) => {
    const current = block.columns || [];
    if (current.length <= 1) return;
    onUpdate(block.id, { columns: current.filter((_, i) => i !== index) });
  };

  const updateColumn = (
    index: number,
    updated: Partial<{
      width?: string;
      blocks: Block[];
    }>
  ) => {
    const current = block.columns || [];
    const next = current.map((column, i) => (i === index ? { ...column, ...updated } : column));
    onUpdate(block.id, { columns: next });
  };

  const widthClass =
    block.alignment === "full" ? "w-full" : block.alignment === "wide" ? "max-w-5xl mx-auto" : "w-auto";

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Columns layout</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <label className="block">
            <span>Align</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.alignment || "none"}
              onChange={(event) => updateSetting("alignment", event.target.value)}
            >
              <option value="none">None</option>
              <option value="wide">Wide width</option>
              <option value="full">Full width</option>
            </select>
          </label>
          <label className="block">
            <span>Vertical alignment</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.verticalAlignment || "top"}
              onChange={(event) => updateSetting("verticalAlignment", event.target.value)}
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
              <option value="stretch">Stretch to fill</option>
            </select>
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={block.stackOnMobile !== false}
              onChange={(event) => updateSetting("stackOnMobile", event.target.checked)}
            />
            Stack on mobile
          </label>
          <div className="flex items-end">
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={addColumn}
            >
              + Add column
            </button>
          </div>
        </div>
      </div>

      <div className={`border rounded p-3 bg-white ${widthClass}`}>
        <div
          className={`grid gap-4 ${block.stackOnMobile !== false ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2"}`}
          style={{
            gridTemplateColumns:
              block.stackOnMobile !== false
                ? undefined
                : `repeat(${Math.max(1, (block.columns || []).length)}, minmax(0, 1fr))`
          }}
        >
          {(block.columns || []).map((column, index) => (
            <div key={column.id || index} className="border rounded p-3 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Column {index + 1}</div>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300 disabled:opacity-50"
                  onClick={() => removeColumn(index)}
                  disabled={(block.columns || []).length <= 1}
                >
                  Remove
                </button>
              </div>
              <label className="block text-sm mb-3">
                <span>Width (e.g. 50%, 20rem)</span>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-2 py-1"
                  value={column.width || ""}
                  onChange={(event) => updateColumn(index, { width: event.target.value })}
                />
              </label>
              <NestedBlocksEditor
                blocks={column.blocks || []}
                onChange={(blocks) => updateColumn(index, { blocks })}
                onFocus={onFocus}
                emptyLabel="No content in this column."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnsBlock;
