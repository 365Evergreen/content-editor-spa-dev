import React from "react";
import { AlignCenter, AlignLeft, AlignRight, Heading1, Heading2, Heading3, Heading4 } from "lucide-react";

export interface HeadingBlockProps {
  block: {
    id: string;
    type: "heading";
    level: number; // 1–4
    text: string;
    align?: "left" | "center" | "right";
  };
  onUpdate: (id: string, updated: Partial<HeadingBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onUpdate, onFocus }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.id, { text: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(block.id, { level: Number(e.target.value) });
  };

  const setLevel = (level: 1 | 2 | 3 | 4) => {
    onUpdate(block.id, { level });
  };

  const setAlign = (align: "left" | "center" | "right") => {
    onUpdate(block.id, { align });
  };

  const headingClass = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-medium"
  }[block.level];

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-2 flex items-center gap-2 rounded-lg border bg-white px-2 py-1">
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setLevel(1)} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setLevel(2)} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setLevel(3)} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setLevel(4)} title="Heading 4">
          <Heading4 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 border-l" />
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setAlign("left")} title="Align left">
          <AlignLeft className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setAlign("center")} title="Align center">
          <AlignCenter className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setAlign("right")} title="Align right">
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 border-l" />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={block.level}
          onChange={handleLevelChange}
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
        </select>
      </div>

      <input
        type="text"
        className={`w-full bg-transparent outline-none ${headingClass} ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"
          }`}
        placeholder="Heading text..."
        value={block.text}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default HeadingBlock;
