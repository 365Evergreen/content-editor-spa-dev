import React from "react";

export interface HeadingBlockProps {
  block: {
    id: string;
    type: "heading";
    level: number; // 1–4
    text: string;
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

  const headingClass = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-medium"
  }[block.level];

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="flex gap-2 mb-2">
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
        className={`w-full bg-transparent outline-none ${headingClass}`}
        placeholder="Heading text..."
        value={block.text}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default HeadingBlock;
