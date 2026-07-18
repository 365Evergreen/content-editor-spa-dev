import React from "react";
import { Clipboard, Eraser, WrapText } from "lucide-react";

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
  const [showToolbar, setShowToolbar] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.id, { language: e.target.value });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(block.id, { code: e.target.value });
  };

  const copyCode = async () => {
    if (!block.code) return;
    await navigator.clipboard.writeText(block.code);
  };

  const clearCode = () => {
    onUpdate(block.id, { code: "" });
  };

  const normalizeIndentation = () => {
    const normalized = block.code
      .split("\n")
      .map((line) => line.replace(/\t/g, "  ").replace(/\s+$/g, ""))
      .join("\n");
    onUpdate(block.id, { code: normalized });
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    setShowToolbar(false);
  };

  return (
    <div
      ref={containerRef}
      className="py-3"
      onClick={() => {
        setShowToolbar(true);
        onFocus?.();
      }}
      onFocusCapture={() => setShowToolbar(true)}
      onBlurCapture={handleBlur}
    >
      {showToolbar && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border bg-white px-2 py-1">
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={normalizeIndentation} title="Normalize indentation">
          <WrapText className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={copyCode} title="Copy code">
          <Clipboard className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={clearCode} title="Clear code">
          <Eraser className="h-4 w-4" />
        </button>
        </div>
      )}

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
