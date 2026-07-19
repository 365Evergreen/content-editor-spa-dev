import React from "react";
import NestedBlocksEditor from "./NestedBlocksEditor";
import type { Block } from "../../../../../hooks/useBlocks";

export interface GridBlockProps {
  block: {
    id: string;
    type: "grid";
    alignment?: "none" | "wide" | "full";
    maxColumns?: number;
    minColumnWidth?: string;
    items: Block[];
  };
  onUpdate: (id: string, updated: Partial<GridBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const GridBlock: React.FC<GridBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSetting = (field: "alignment" | "maxColumns" | "minColumnWidth", value: string | number) => {
    onUpdate(block.id, { [field]: value });
  };

  const widthClass =
    block.alignment === "full" ? "w-full" : block.alignment === "wide" ? "max-w-5xl mx-auto" : "w-auto";
  const maxColumns = Math.max(1, Number(block.maxColumns || 3));
  const minColumnWidth = block.minColumnWidth || "12rem";

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Grid layout</div>
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
            <span>Max columns</span>
            <input
              type="number"
              min={1}
              max={12}
              className="mt-1 w-full border rounded px-2 py-1"
              value={maxColumns}
              onChange={(event) => updateSetting("maxColumns", Number(event.target.value || 1))}
            />
          </label>

          <label className="block md:col-span-2">
            <span>Min column width</span>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={minColumnWidth}
              onChange={(event) => updateSetting("minColumnWidth", event.target.value)}
              placeholder="12rem"
            />
          </label>
        </div>
      </div>

      <div className={`border rounded p-3 bg-white ${widthClass}`}>
        <NestedBlocksEditor
          blocks={block.items || []}
          onChange={(items) => onUpdate(block.id, { items })}
          onFocus={onFocus}
          emptyLabel="No grid items yet."
          layoutClassName="grid gap-3"
          layoutStyle={{
            gridTemplateColumns: `repeat(${maxColumns}, minmax(${minColumnWidth}, 1fr))`
          }}
        />
      </div>
    </div>
  );
};

export default GridBlock;
