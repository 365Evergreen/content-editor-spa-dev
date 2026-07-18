import React from "react";
import { Columns3, Minus, Plus, Rows3 } from "lucide-react";

export interface TableBlockProps {
  block: {
    id: string;
    type: "table";
    domain: "text";
    rows: string[][];
  };
  onUpdate: (id: string, updated: Partial<TableBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const TableBlock: React.FC<TableBlockProps> = ({ block, onUpdate, onFocus }) => {
  const [showToolbar, setShowToolbar] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updated = block.rows.map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? value : cell)) : row
    );
    onUpdate(block.id, { rows: updated });
  };

  const addRow = () => {
    const cols = block.rows[0]?.length || 3;
    onUpdate(block.id, { rows: [...block.rows, Array(cols).fill("")] });
  };

  const addColumn = () => {
    const updated = block.rows.map((row) => [...row, ""]);
    onUpdate(block.id, { rows: updated });
  };

  const removeRow = () => {
    if (block.rows.length <= 1) return;
    onUpdate(block.id, { rows: block.rows.slice(0, -1) });
  };

  const removeColumn = () => {
    const colCount = block.rows[0]?.length ?? 0;
    if (colCount <= 1) return;
    const updated = block.rows.map((row) => row.slice(0, -1));
    onUpdate(block.id, { rows: updated });
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
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={addRow} title="Add row">
          <Rows3 className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={removeRow} title="Remove row">
          <Minus className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 border-l" />
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={addColumn} title="Add column">
          <Columns3 className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-gray-100" onClick={removeColumn} title="Remove column">
          <Plus className="h-4 w-4 rotate-45" />
        </button>
        </div>
      )}

      <div className="overflow-auto border rounded">
        <table className="min-w-full border-collapse">
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    <input
                      type="text"
                      className="w-full outline-none"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addRow}
        >
          + Row
        </button>

        <button
          type="button"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addColumn}
        >
          + Column
        </button>
      </div>
    </div>
  );
};

export default TableBlock;
