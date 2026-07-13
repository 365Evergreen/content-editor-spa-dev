import React from "react";

// Domain renderers
import TextRenderer from "./TextRenderer";
import MediaRenderer from "./MediaRenderer";
import DesignRenderer from "./DesignRenderer";


export interface BlockRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onUpdate, onFocus }) => {
  switch (block.type) {
    //
    // TEXT DOMAIN
    //
    case "paragraph":
    case "heading":
    case "list":
      return (
        <TextRenderer
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    //
    // MEDIA DOMAIN
    //
    case "image":
      return (
        <MediaRenderer
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    //
    // DESIGN DOMAIN
    //
    case "accordion":
    case "button":
    case "columns":
    case "grid":
    case "group":
    case "row":
    case "stack":
      return (
        <DesignRenderer
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    //
    // UNKNOWN BLOCK TYPE
    //
    default:
      return (
        <div className="text-red-600">
          Unknown block type: {block.type}
        </div>
      );
  }
};

export default BlockRenderer;
