import React from "react";

export interface EditorHeaderProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  children?: React.ReactNode; // optional toolbar content
}


const EditorHeader: React.FC<EditorHeaderProps> = ({
  onToggleLeft,
  onToggleRight,
  children
}) => {
  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="bg-green-500 hover:bg-gray-100 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
          onClick={onToggleLeft}
        >
          Toggle Left
        </button>

        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
          onClick={onToggleRight}
        >
          Toggle Right
        </button>
      </div>

      <div>{children}</div>
    </header>
  );
};

export default EditorHeader;
