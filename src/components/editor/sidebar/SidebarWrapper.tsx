import React from "react";
import { useEditor } from "../../../context/EditorContext";
import { PropertyEditorRegistry } from "./PropertyEditorRegistry";
import type {Block} from "../../../hooks/useBlocks";

interface SidebarWrapperProps {
  children: React.ReactNode;
  blocks: Block[];
  onUpdateBlock: (id: string, updated: Partial<Block>) => void;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children, blocks, onUpdateBlock }) => {
  const { selectedBlockId } = useEditor();
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const Editor = selectedBlock ? PropertyEditorRegistry[selectedBlock.type] : null;

  return (
    <>
      {Editor && selectedBlock ? (
        <Editor block={selectedBlock} onUpdate={(updates) => onUpdateBlock(selectedBlock.id, updates)} />
      ) : (
        children
      )}
    </>
  );
};
