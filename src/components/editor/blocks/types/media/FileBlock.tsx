import React from "react";

export interface FileBlockProps {
  block: {
    id: string;
    type: "file";
    name: string;
    url: string;
  };
  onUpdate: (id: string, updated: Partial<FileBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const FileBlock: React.FC<FileBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateName = (value: string) => onUpdate(block.id, { name: value });
  const updateUrl = (value: string) => onUpdate(block.id, { url: value });

  return (
    <div className="py-3" onClick={onFocus}>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="File name"
        value={block.name}
        onChange={(e) => updateName(e.target.value)}
      />

      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        placeholder="File URL"
        value={block.url}
        onChange={(e) => updateUrl(e.target.value)}
      />

      {block.url && (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-blue-600 underline"
        >
          Download {block.name || "file"}
        </a>
      )}
    </div>
  );
};

export default FileBlock;
