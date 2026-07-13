import React from "react";

export interface EditorCanvasProps {
  children: React.ReactNode;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ children }) => {
  return (
<main className="bg-gray-100 col-span-12 min-h-[100vh] overflow-auto">
  {children}
</main>


  );
};

export default EditorCanvas;
