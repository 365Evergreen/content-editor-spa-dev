import { useState } from "react";
import { createBlock, type Block as EditorBlock } from "./blockDefaults";

export type Block = EditorBlock;

const useBlocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  //
  // ADD BLOCK
  //
  const addBlock = (type: string) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
  };

  //
  // UPDATE BLOCK
  //
  const updateBlock = (id: string, updated: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updated } : block
      )
    );
  };

  //
  // MOVE BLOCK (UP/DOWN)
  //
  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;

      return updated;
    });
  };

  //
  // DELETE BLOCK
  //
  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    moveBlock,
    deleteBlock
  };
};

export default useBlocks;
