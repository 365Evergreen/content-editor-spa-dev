import React from "react";
import BlockRenderer from "../../renderers/BlockRenderer";
import { createBlock } from "../../../../../hooks/blockDefaults";
import type { Block } from "../../../../../hooks/useBlocks";

const CHILD_BLOCK_OPTIONS: Array<{ type: string; label: string }> = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading" },
  { type: "list", label: "List" },
  { type: "code", label: "Code" },
  { type: "table", label: "Table" },
  { type: "image", label: "Image" },
  { type: "gallery", label: "Gallery" },
  { type: "audio", label: "Audio" },
  { type: "video", label: "Video" },
  { type: "cover", label: "Cover" },
  { type: "file", label: "File" },
  { type: "button", label: "Buttons" },
  { type: "accordion", label: "Accordion" },
  { type: "columns", label: "Columns" },
  { type: "grid", label: "Grid" },
  { type: "group", label: "Group" },
  { type: "row", label: "Row" },
  { type: "stack", label: "Stack" }
];

export interface NestedBlocksEditorProps {
  blocks: Block[];
  onChange: (nextBlocks: Block[]) => void;
  onFocus?: () => void;
  emptyLabel?: string;
  addLabel?: string;
  layoutClassName?: string;
  layoutStyle?: React.CSSProperties;
}

const NestedBlocksEditor: React.FC<NestedBlocksEditorProps> = ({
  blocks,
  onChange,
  onFocus,
  emptyLabel = "No inner blocks yet.",
  addLabel = "Add block",
  layoutClassName = "space-y-4",
  layoutStyle
}) => {
  const [pendingType, setPendingType] = React.useState("paragraph");

  const updateChild = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map((child) => (child.id === id ? { ...child, ...updates } : child)));
  };

  const moveChild = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const removeChild = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const addChild = () => {
    onChange([...blocks, createBlock(pendingType)]);
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && <div className="text-sm text-gray-500 italic">{emptyLabel}</div>}

      <div className={layoutClassName} style={layoutStyle}>
        {blocks.map((child, index) => (
          <div key={child.id} className="border rounded bg-white p-2">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => moveChild(index, "up")}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => moveChild(index, "down")}
                disabled={index === blocks.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                onClick={() => removeChild(index)}
              >
                Remove
              </button>
            </div>

            <BlockRenderer block={child} onUpdate={updateChild} onFocus={onFocus} />
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={pendingType}
          onChange={(event) => setPendingType(event.target.value)}
        >
          {CHILD_BLOCK_OPTIONS.map((option) => (
            <option key={option.type} value={option.type}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addChild}
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
};

export default NestedBlocksEditor;
