import React, { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    const editable = editableRef.current;
    if (!editable) return;
    if (document.activeElement === editable) return;

    const nextHtml = block.text || "";
    if (editable.innerHTML !== nextHtml) {
      editable.innerHTML = nextHtml;
    }
  }, [block.text]);

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
    editableRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    if (editableRef.current) {
      onUpdate(block.id, { text: editableRef.current.innerHTML });
    }
    saveSelection();
  };

  const preventToolbarBlur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const updateAlign = (align: "left" | "center" | "right") => {
    const commandMap: Record<"left" | "center" | "right", string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight"
    };

    applyFormat(commandMap[align]);
    onUpdate(block.id, { align });
  };

  const toggleBulletList = () => {
    applyFormat("insertUnorderedList");
  };

  const insertLink = () => {
    const url = prompt("Enter link URL");
    if (!url) return;
    applyFormat("createLink", url);
  };

  const toggleQuote = () => {
    applyFormat("formatBlock", "blockquote");
  };

  const clearFormatting = () => {
    applyFormat("removeFormat");
    applyFormat("unlink");
  };

  return (
    <div
      className="relative"
      onClick={() => {
        setShowToolbar(true);
        onFocus?.();
      }}
      ref={containerRef}
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
            onClick={toggleBulletList}
          >
            <List className="w-4 h-4" />
          </button>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={insertLink}
          >
            <Link className="w-4 h-4" />
          </button>
         
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={toggleQuote}
          >
            <Quote className="w-4 h-4" />
          </button>


          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={clearFormatting}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* Editable paragraph */}
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        className={`w-full outline-none bg-white p-2 rounded-md border 1px border-gray-300 text-left
              ${block.align === "center" ? "text-center" : ""}
              ${block.align === "right" ? "text-right" : ""}`}
        onInput={(e) => {
          onUpdate(block.id, { text: e.currentTarget.innerHTML });
          saveSelection();
        }}
        onFocus={() => {
          setShowToolbar(true);
          saveSelection();
          onFocus?.();
        }}
        onBlur={(e) => {
          if (containerRef.current?.contains(e.relatedTarget as Node)) {
            return;
          }
          setShowToolbar(false);
        }}
      />

    </div>
  );
};

export default ParagraphBlock;
