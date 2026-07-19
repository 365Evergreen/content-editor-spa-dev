import React from "react";
import TextareaCodeEditor from "@uiw/react-textarea-code-editor";
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

const languageMap: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  java: "java",
  csharp: "csharp",
  cpp: "cpp",
  ruby: "ruby",
  go: "go",
  text: "text"
};

const CodeBlock: React.FC<CodeBlockProps> = ({ block, onUpdate, onFocus }) => {
  const [showToolbar, setShowToolbar] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <select
          className="rounded p-1 hover:bg-gray-100"
          value={block.language}
          onChange={handleLanguageChange}
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
        </select>
      </div>
      )}

      {/* Language */}
      <TextareaCodeEditor
        value={block.code}
        language={languageMap[block.language] ?? "text"}
        placeholder="Write code here..."
        onChange={handleCodeChange}
        onFocus={onFocus}
        padding={12}
        style={{
          fontSize: 14,
          backgroundColor: "var(--code-bg)",
          fontFamily: "var(--mono)",
          minHeight: 190,
          width: "100%",
          borderRadius: 8,
          border: "1px solid #d1d5db"
        }}
      />
    </div>
  );
};

export default CodeBlock;
