import type {Block} from "../../../hooks/useBlocks";

export interface PropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export type PropertyEditorComponent = React.FC<PropertyEditorProps>;
