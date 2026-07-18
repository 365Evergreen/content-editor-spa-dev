import React from "react";
import type {PropertyEditorProps} from "../PropertyEditorTypes";

export const ParagraphPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm">Paragraph Settings</h4>
      <label className="block text-xs text-gray-500">
        Alignment
        <select
          value={block.align || "left"}
          onChange={(e) => onUpdate({ align: e.target.value as any })}
          className="w-full mt-1 border rounded p-1"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </div>
  );
};
