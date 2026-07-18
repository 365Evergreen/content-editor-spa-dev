import React from "react";

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

  return (
    <div className="py-3" onClick={onFocus}>
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
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addRow}
        >
          + Row
        </button>

        <button
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
