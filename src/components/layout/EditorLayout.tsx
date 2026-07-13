import React from "react";

import EditorHeader from "./EditorHeader";
import EditorSidebarLeft from "./EditorSidebarLeft";
import EditorSidebarRight from "./EditorSidebarRight";
import EditorCanvas from "./EditorCanvas";

export interface EditorLayoutProps {
  headerContent?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  headerContent,
  leftSidebar,
  rightSidebar,
  children
}) => {
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);

  return (
    <div className="w-full min-h-screen p-0 bg-red-100 flex flex-col">

      {/* HEADER */}
      <EditorHeader
        onToggleLeft={() => setLeftOpen((v) => !v)}
        onToggleRight={() => setRightOpen((v) => !v)}
      >
        {headerContent}
      </EditorHeader>

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-12">

        {/* LEFT SIDEBAR */}
        {leftOpen && leftSidebar && (
          <EditorSidebarLeft>{leftSidebar}</EditorSidebarLeft>
        )}

        {/* CANVAS */}
        <div
          className={
            leftOpen && rightOpen
              ? "col-span-6"
              : leftOpen && !rightOpen
              ? "col-span-9"
              : !leftOpen && rightOpen
              ? "col-span-9"
              : "col-span-12"
          }
        >
          <EditorCanvas>{children}</EditorCanvas>
        </div>

        {/* RIGHT SIDEBAR */}
        {rightOpen && rightSidebar && (
          <EditorSidebarRight>{rightSidebar}</EditorSidebarRight>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;
