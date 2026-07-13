import React from "react";

export interface EditorSidebarRightProps {
  children: React.ReactNode;
}

const EditorSidebarRight: React.FC<EditorSidebarRightProps> = ({ children }) => {
  return (
    <aside className="col-span-3 bg-white border p-4 overflow-auto">
      {children}
    </aside>
  );
};

export default EditorSidebarRight;
