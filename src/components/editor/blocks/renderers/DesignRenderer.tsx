import React from "react";

// Design-domain block types
import AccordionBlock from "../types/design/AccordionBlock";
import ButtonBlock from "../types/design/ButtonBlock";
import ColumnsBlock from "../types/design/ColumnsBlock";
import GridBlock from "../types/design/GridBlock";
import GroupBlock from "../types/design/GroupBlock";
import RowBlock from "../types/design/RowBlock";
import StackBlock from "../types/design/StackBlock";
export interface DesignRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const DesignRenderer: React.FC<DesignRendererProps> = ({ block, onUpdate, onFocus }) => {
  switch (block.type) {
    case "accordion":
      return (
        <AccordionBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "button":
      return (
        <ButtonBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "columns":
      return (
        <ColumnsBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "grid":
      return (
        <GridBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "group":
        return (
            <GroupBlock
              block={block}
              onUpdate={onUpdate}
              onFocus={onFocus}
            />
        );

    case "row":
        return (
            <RowBlock
              block={block}
              onUpdate={onUpdate}
              onFocus={onFocus}
            />
        );

    case "stack":
        return (
            <StackBlock
              block={block}
              onUpdate={onUpdate}
              onFocus={onFocus}
            />
        );

    default:
      return (
        <div className="text-red-600">
          Unknown design block type: {block.type}
        </div>
      );
  }
};

export default DesignRenderer;
