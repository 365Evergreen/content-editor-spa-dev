import React from "react";

export interface EditorSidebarLeftProps {
  children: React.ReactNode;
}

const EditorSidebarLeft: React.FC<EditorSidebarLeftProps> = ({ children }) => {
  return (
    <aside className="col-span-3 bg-red-500 border p-4 overflow-auto">
      {children}
    </aside>
  );
};

export default EditorSidebarLeft;
