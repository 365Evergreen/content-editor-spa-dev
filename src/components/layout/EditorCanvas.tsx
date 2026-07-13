import React from "react";

export interface EditorCanvasProps {
  children: React.ReactNode;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ children }) => {
  return (
<main className="bg-white border rounded-lg min-h-[70vh] overflow-auto">
  {children}
</main>


  );
};

export default EditorCanvas;
