import React from "react";

export interface GridBlockProps {
  block: {
    id: string;
    type: "grid";
    rows: number;
    cols: number;
    cells: string[][];
  };
  onUpdate: (id: string, updated: Partial<GridBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const GridBlock: React.FC<GridBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateCell = (r: number, c: number, value: string) => {
    const updated = block.cells.map((row, ri) =>
      ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row
    );
    onUpdate(block.id, { cells: updated });
  };

  const addRow = () => {
    const newRow = Array(block.cols).fill("");
    onUpdate(block.id, { rows: block.rows + 1, cells: [...block.cells, newRow] });
  };

  const addColumn = () => {
    const updated = block.cells.map((row) => [...row, ""]);
    onUpdate(block.id, { cols: block.cols + 1, cells: updated });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="overflow-auto border rounded">
        <table className="min-w-full border-collapse">
          <tbody>
            {block.cells.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border p-2">
                    <input
                      type="text"
                      className="w-full outline-none"
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
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

export default GridBlock;
