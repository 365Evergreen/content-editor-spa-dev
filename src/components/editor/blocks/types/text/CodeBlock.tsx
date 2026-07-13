import React from "react";

export interface CodeBlockProps {
  block: {
    id: string;
    type: "code";
    language: string;
    code: string;
  };
  onUpdate: (id: string, updated: Partial<CodeBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ block, onUpdate, onFocus }) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.id, { language: e.target.value });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(block.id, { code: e.target.value });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      {/* Language */}
      <input
        type="text"
        className="mb-2 w-full border rounded px-2 py-1 text-sm"
        placeholder="Language (e.g., typescript)"
        value={block.language}
        onChange={handleLanguageChange}
      />

      {/* Code */}
      <textarea
        className="w-full border rounded p-2 font-mono text-sm bg-gray-100"
        rows={6}
        placeholder="Write code here..."
        value={block.code}
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeBlock;
