import React from "react";

export interface BlockToolbarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const BlockToolbar: React.FC<BlockToolbarProps> = ({
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={onMoveUp}
      >
        ↑
      </button>

      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={onMoveDown}
      >
        ↓
      </button>

      <button
        className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
        onClick={onDelete}
      >
        🗑
      </button>
    </div>
  );
};

export default BlockToolbar;
