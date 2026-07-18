import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Quote,
  Underline,
  MoreHorizontal
} from "lucide-react";

export interface ParagraphBlockProps {
  block: {
    id: string;
    type: "paragraph";
    text: string;
    align?: "left" | "center" | "right";
  };
  onUpdate: (id: string, updated: Partial<ParagraphBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({
  block,
  onUpdate,
  onFocus
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && selectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    ref.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
  };

  const preventToolbarBlur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const updateAlign = (align: "left" | "center" | "right") => {
    onUpdate(block.id, { align });
  };

  return (
    <div
      className="relative"
      onClick={() => {
        setShowToolbar(true);
        onFocus?.();
      }}
      ref={ref}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div
          className="absolute -top-12 left-0 bg-white border shadow-md rounded-lg 
               flex items-center gap-2 px-3 py-2 z-20"
          onMouseDown={preventToolbarBlur}
        >
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => applyFormat("bold")}
          >
            <Bold className="w-4 h-4" />
          </button>


          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => applyFormat("italic")}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => applyFormat("underline")}
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => updateAlign("left")}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => applyFormat("underline")}
          >
            <Underline className="w-4 h-4" />
          </button>


          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => updateAlign("center")}
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => updateAlign("right")}
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              // list logic
            }}
          >
            <List className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              // link logic
            }}
          >
            <Link className="w-4 h-4" />
          </button>
         
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              // quote logic
            }}
          >
            <Quote className="w-4 h-4" />
          </button>


          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              // more menu
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* Editable paragraph */}
      <div
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        className={`w-full outline-none bg-white p-2 rounded-md border 1px border-gray-300 text-left
              ${block.align === "center" ? "text-center" : ""}
              ${block.align === "right" ? "text-right" : ""}`}
        onInput={(e) => onUpdate(block.id, { text: e.currentTarget.innerHTML })}
        onFocus={() => {
          setShowToolbar(true);
          saveSelection();
          onFocus?.();
        }}
        onBlur={(e) => {
          if (ref.current?.contains(e.relatedTarget as Node)) {
            return;
          }
          setShowToolbar(false);
        }}
        dangerouslySetInnerHTML={{ __html: block.text }}
      />

    </div>
  );
};

export default ParagraphBlock;
