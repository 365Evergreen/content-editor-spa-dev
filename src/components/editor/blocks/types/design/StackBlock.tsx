import React from "react";
import NestedBlocksEditor from "./NestedBlocksEditor";
import type { Block } from "../../../../../hooks/useBlocks";

export interface StackBlockProps {
  block: {
    id: string;
    type: "stack";
    alignment?: "none" | "wide" | "full";
    justification?: "top" | "middle" | "bottom" | "space-between";
    horizontalAlignment?: "left" | "center" | "right" | "stretch";
    gap?: string;
    children: Block[];
  };
  onUpdate: (id: string, updated: Partial<StackBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const StackBlock: React.FC<StackBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateSetting = (
    key: "alignment" | "justification" | "horizontalAlignment" | "gap",
    value: string
  ) => onUpdate(block.id, { [key]: value });

  const justifyClass =
    block.justification === "middle"
      ? "justify-center"
      : block.justification === "bottom"
        ? "justify-end"
        : block.justification === "space-between"
          ? "justify-between"
          : "justify-start";
  const alignClass =
    block.horizontalAlignment === "center"
      ? "items-center"
      : block.horizontalAlignment === "right"
        ? "items-end"
        : block.horizontalAlignment === "stretch"
          ? "items-stretch"
          : "items-start";
  const widthClass =
    block.alignment === "full" ? "w-full" : block.alignment === "wide" ? "max-w-5xl mx-auto" : "w-auto";

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Stack layout</div>
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
            <span>Vertical distribution</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.justification || "top"}
              onChange={(event) => updateSetting("justification", event.target.value)}
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
              <option value="space-between">Space between</option>
            </select>
          </label>
          <label className="block">
            <span>Horizontal alignment</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.horizontalAlignment || "left"}
              onChange={(event) => updateSetting("horizontalAlignment", event.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
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
        </div>
      </div>

      <div className={`border rounded p-3 bg-white ${widthClass}`}>
        <NestedBlocksEditor
          blocks={block.children || []}
          onChange={(children) => onUpdate(block.id, { children })}
          onFocus={onFocus}
          emptyLabel="No inner blocks in this stack."
          layoutClassName={`flex flex-col ${justifyClass} ${alignClass}`}
          layoutStyle={{ gap: block.gap || "12px" }}
        />
      </div>
    </div>
  );
};

export default StackBlock;
