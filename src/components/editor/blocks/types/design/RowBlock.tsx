import React from "react";
import NestedBlocksEditor from "./NestedBlocksEditor";
import type { Block } from "../../../../../hooks/useBlocks";

export interface RowBlockProps {
  block: {
    id: string;
    type: "row";
    alignment?: "none" | "wide" | "full";
    justification?: "left" | "center" | "right" | "space-between";
    verticalAlignment?: "top" | "middle" | "bottom" | "stretch";
    wrap?: boolean;
    gap?: string;
    children: Block[];
  };
  onUpdate: (id: string, updated: Partial<RowBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const RowBlock: React.FC<RowBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSetting = (
    key: "alignment" | "justification" | "verticalAlignment" | "gap" | "wrap",
    value: string | boolean
  ) => onUpdate(block.id, { [key]: value });

  const justifyClass =
    block.justification === "center"
      ? "justify-center"
      : block.justification === "right"
        ? "justify-end"
        : block.justification === "space-between"
          ? "justify-between"
          : "justify-start";
  const alignClass =
    block.verticalAlignment === "middle"
      ? "items-center"
      : block.verticalAlignment === "bottom"
        ? "items-end"
        : block.verticalAlignment === "stretch"
          ? "items-stretch"
          : "items-start";
  const widthClass =
    block.alignment === "full" ? "w-full" : block.alignment === "wide" ? "max-w-5xl mx-auto" : "w-auto";

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Row layout</div>
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
            <span>Justification</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.justification || "left"}
              onChange={(event) => updateSetting("justification", event.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="space-between">Space between</option>
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
              <option value="stretch">Stretch</option>
            </select>
          </label>
          <label className="block">
            <span>Gap</span>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.gap || "12px"}
              onChange={(event) => updateSetting("gap", event.target.value)}
              placeholder="12px"
            />
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={block.wrap !== false}
              onChange={(event) => updateSetting("wrap", event.target.checked)}
            />
            Wrap to multiple lines
          </label>
        </div>
      </div>

      <div className={`border rounded p-3 bg-white ${widthClass}`}>
        <NestedBlocksEditor
          blocks={block.children || []}
          onChange={(children) => onUpdate(block.id, { children })}
          onFocus={onFocus}
          emptyLabel="No inner blocks in this row."
          layoutClassName={`flex flex-row ${justifyClass} ${alignClass} ${block.wrap === false ? "" : "flex-wrap"}`}
          layoutStyle={{ gap: block.gap || "12px" }}
        />
      </div>
    </div>
  );
};

export default RowBlock;
