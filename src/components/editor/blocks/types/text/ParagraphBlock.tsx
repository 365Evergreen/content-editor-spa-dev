import React from "react";

export interface ParagraphBlockProps {
  block: {
    id: string;
    type: "paragraph";
    text: string;
  };
  onUpdate: (id: string, updated: Partial<ParagraphBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block, onUpdate, onFocus }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(block.id, { text: e.target.value });
  };

  return (
    <div
      className="w-full py-2"
      onClick={onFocus}
    >
      <textarea
        className="
          w-full
          resize-none
          bg-transparent
          text-base
          leading-relaxed
          outline-none
          p-2
          rounded-md
          border border-transparent
          focus:border-gray-300
          focus:bg-white
          transition
        "
        placeholder="Start writing..."
        value={block.text}
        onChange={handleChange}
        rows={block.text?.length > 80 ? 4 : 2}
      />
    </div>
  );
};

export default ParagraphBlock;
