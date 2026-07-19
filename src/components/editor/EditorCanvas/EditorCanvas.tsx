import React from "react";
import BlockRenderer from "../blocks/renderers/BlockRenderer";
import BlockToolbar from "../blocks/BlockToolbar";
import { useEditor } from "../../../context/EditorContext";

export interface EditorCanvasProps {
  blocks: any[];
  onUpdateBlock: (id: string, updated: Partial<any>) => void;
  onAddBlock: (type: string) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
  onDeleteBlock: (id: string) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  onUpdateBlock,
  onAddBlock,
  onMoveBlock,
  onDeleteBlock
}) => {
  const { selectedBlockId, setSelectedBlockId } = useEditor();

  return (
    <div className="w-full p-6 bg-gray-50 border rounded-lg">
      {/* Canvas Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Content</h2>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("paragraph")}
          >
            + Paragraph
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("heading")}
          >
            + Heading
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("image")}
          >
            + Image
          </button>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 && (
        <div className="text-gray-500 italic">No content yet. Add a block to begin.</div>
      )}

      {blocks.map((block) => (
        <div
          key={block.id}
          className={`mb-8 rounded-md p-2 transition ${
            selectedBlockId === block.id ? "ring-2 ring-blue-300 bg-white" : ""
          }`}
          onClick={() => setSelectedBlockId(block.id)}
        >
          <BlockToolbar
            onMoveUp={() => onMoveBlock(block.id, "up")}
            onMoveDown={() => onMoveBlock(block.id, "down")}
            onDelete={() => onDeleteBlock(block.id)}
          />
          <BlockRenderer
            block={block}
            onUpdate={onUpdateBlock}
            onFocus={() => setSelectedBlockId(block.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default EditorCanvas;
