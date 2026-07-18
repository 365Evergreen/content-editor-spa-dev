import React, { createContext, useContext, useState } from "react";

interface EditorContextType {
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <EditorContext.Provider value={{ selectedBlockId, setSelectedBlockId }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
