import React from "react";

// Text-domain block types
import ParagraphBlock from "../types/text/ParagraphBlock";
import HeadingBlock from "../types/text/HeadingBlock";
import ListBlock from "../types/text/ListBlock";
import CodeBlock from "../types/text/CodeBlock";
import TableBlock from "../types/text/TableBlock";

export interface TextRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const TextRenderer: React.FC<TextRendererProps> = ({ block, onUpdate, onFocus }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "heading":
      return (
        <HeadingBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "list":
      return (
        <ListBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "code":
      return (
        <CodeBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "table":
      return (
        <TableBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    default:
      return (
        <div className="text-red-600">
          Unknown text block type: {block.type}
        </div>
      );
  }
};

export default TextRenderer;
